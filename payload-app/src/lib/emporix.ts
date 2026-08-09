/**
 * Minimal Emporix API client — teaching example.
 *
 * Field IDs below are confirmed from the team's own api.py (convert_to_emporix_data),
 * not guessed — see mixins schema 6a6b3582e7cadf3c8a834e15.
 */

const EMPORIX_API_BASE_URL =
  process.env.EMPORIX_API_BASE_URL ?? 'https://api.emporix.io'
const EMPORIX_TENANT_ID = process.env.EMPORIX_TENANT_ID
const EMPORIX_CLIENT_ID = process.env.EMPORIX_CLIENT_ID
const EMPORIX_CLIENT_SECRET = process.env.EMPORIX_CLIENT_SECRET

// Confirmed from the team's mapper (api.py / convert_to_emporix_data).
// If the schema changes, update these — there's no way to resolve them
// automatically without fetching and parsing the schema JSON.
const MIXIN_SCHEMA_ID = '6a6b3582e7cadf3c8a834e15'
const FIELD = {
  authors: '1e916fe6-b678-4ecc-bbae-bc26e2323305',
  authorRole: '0752e4e2-0c78-4f77-b051-397962ae0a55',
  authorName: 'ea660a09-a300-4815-92a2-3387e61a3775',
  publisher: '0e70195d-3327-4e1e-8ba3-19291d0851ca',
  publicationDate: '5424cd7c-bb1c-47d4-be6c-916c1cb1f0d0',
  subtitle: '5b10f342-26b7-4573-9c3d-ea1d70c11053',
  category: '7b55e0d4-abd8-41e0-afb2-841010a3e2a2',
  language: '225d2927-f0aa-412c-a7da-a4aee78a2351',
  pageCount: 'ce763c33-8352-46e6-ba05-04ac6bb64c0c',
  productForm: 'ee7a09b7-1769-47bf-83c3-4caadc60bb78',
} as const

// --- Token caching --------------------------------------------------------

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value
  }

  if (!EMPORIX_CLIENT_ID || !EMPORIX_CLIENT_SECRET) {
    throw new Error(
      'Missing EMPORIX_CLIENT_ID / EMPORIX_CLIENT_SECRET — check your .env',
    )
  }

  const basicAuth = Buffer.from(
    `${EMPORIX_CLIENT_ID}:${EMPORIX_CLIENT_SECRET}`,
  ).toString('base64')

  const response = await fetch(`${EMPORIX_API_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Emporix auth failed (${response.status}): ${body}`)
  }

  const data = await response.json()

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }

  return cachedToken.value
}

// --- Types -----------------------------------------------------------

type RawEmporixProduct = {
  id: string
  code: string
  name: Record<string, string>
  description?: Record<string, string>
  media?: { url: string }[]
  categoryIds?: string[]
  mixins?: {
    [MIXIN_SCHEMA_ID]?: {
      [FIELD.authors]?: { [k: string]: string }[]
      [FIELD.publisher]?: string
      [FIELD.publicationDate]?: string
      [FIELD.subtitle]?: string
      [FIELD.category]?: string
      [FIELD.language]?: string
      [FIELD.pageCount]?: number
      [FIELD.productForm]?: string
    }
  }
}

export type BookDetails = {
  id: string
  isbn: string
  title: string
  subtitle?: string
  description?: string
  coverImageUrl?: string
  authors: { role: string; name: string }[]
  publisher?: string
  publicationDate?: string
  category?: string
  language?: string
  pageCount?: number
  productForm?: string
}

export type PriceInfo = { amount: number; currency: string }
export type AvailabilityInfo = { stockLevel: number; available: boolean }

// --- Fetch + shape the product -----------------------------------------

function firstLocalized(obj?: Record<string, string>): string | undefined {
  if (!obj) return undefined
  return obj.en ?? Object.values(obj)[0]
}

export async function getBookById(productId: string): Promise<BookDetails | null> {
  if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID')
  const token = await getAccessToken()

  const response = await fetch(
    `${EMPORIX_API_BASE_URL}/product/${EMPORIX_TENANT_ID}/products/${productId}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  )

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`Emporix product fetch failed (${response.status}): ${await response.text()}`)
  }

  const product: RawEmporixProduct = await response.json()
  const mixin = product.mixins?.[MIXIN_SCHEMA_ID] ?? {}

  const authors = (mixin[FIELD.authors] ?? []).map((a) => ({
    role: a[FIELD.authorRole],
    name: a[FIELD.authorName],
  }))

  return {
    id: product.id,
    isbn: product.code,
    title: firstLocalized(product.name) ?? '(no title)',
    subtitle: mixin[FIELD.subtitle],
    description: firstLocalized(product.description),
    coverImageUrl: product.media?.[0]?.url,
    authors,
    publisher: mixin[FIELD.publisher],
    publicationDate: mixin[FIELD.publicationDate],
    category: mixin[FIELD.category],
    language: mixin[FIELD.language],
    pageCount: mixin[FIELD.pageCount],
    productForm: mixin[FIELD.productForm],
  }
}

// --- Price and availability (separate Emporix services) -----------------
// These live outside the product/mixin entirely — the team's api.py posts
// to /price/... and /availability/... after creating the product. We read
// them the same way here, as two more calls, kept clearly separate.

export async function getBookPrices(productId: string): Promise<PriceInfo[]> {
  if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID')
  const token = await getAccessToken()

  const response = await fetch(
    `${EMPORIX_API_BASE_URL}/price/${EMPORIX_TENANT_ID}/prices?q=itemId.id:${productId}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  )

  if (!response.ok) return []

  const data = await response.json()
  const list = Array.isArray(data) ? data : data.results ?? []

  return list.map((p: any) => ({
    amount: p.tierValues?.[0]?.priceValue ?? 0,
    currency: p.currency ?? 'EUR',
  }))
}

export async function getBookAvailability(
  productId: string,
  site = 'main',
): Promise<AvailabilityInfo | null> {
  if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID')
  const token = await getAccessToken()

  const response = await fetch(
    `${EMPORIX_API_BASE_URL}/availability/${EMPORIX_TENANT_ID}/availability/${productId}/${site}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  )

  if (!response.ok) return null

  const data = await response.json()
  return { stockLevel: data.stockLevel ?? 0, available: data.available ?? false }
}
