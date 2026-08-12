const EMPORIX_API_BASE_URL: string = process.env.EMPORIX_API_BASE_URL ?? 'https://api.emporix.io'
const EMPORIX_TENANT_ID: string | undefined = process.env.EMPORIX_TENANT_ID
const EMPORIX_CLIENT_ID: string | undefined = process.env.EMPORIX_CLIENT_ID
const EMPORIX_CLIENT_SECRET: string | undefined = process.env.EMPORIX_CLIENT_SECRET

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

//---------TOKEN CACHING-------------
let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.value
    }

    if (!EMPORIX_CLIENT_ID || !EMPORIX_CLIENT_SECRET) {
        throw new Error('EMPORIX_CLIENT_ID or EMPORIX_CLIENT_SECRET missing')
    }

    const response = await fetch(`${EMPORIX_API_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: EMPORIX_CLIENT_ID,
            client_secret: EMPORIX_CLIENT_SECRET,
        }),
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch Emporix access token: ${response.statusText}`)
    }

    const data = await response.json()

    cachedToken = {
        value: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    }

    return cachedToken.value
}
//-------------GET BOOK BY ID-----------------

type emporixProductStructure = {
    id: string
    code: string
    name: Record<string, string>
    description?: Record<string, string>
    media?: { url: string }[]
    categoryIds?: string[]
    mixins?: {
        [MIXIN_SCHEMA_ID]?: {
            [FIELD.authors]?: { [key: string]: string }[]
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

export type Author = {
    role: string
    name: string
}

export type BookDetails = {
    id: string
    isbn: string
    title: string
    subtitle?: string
    description?: string
    coverImageUrl?: string
    authors: Author[]
    publisher?: string
    publicationDate?: string
    category?: string
    language?: string
    pageCount?: number
    productForm?: string
}

function firstLocalized(obj?: Record<string, string>): string | undefined {
    if (!obj) return undefined
    return obj.en ?? Object.values(obj)[0]
}

export async function getBookById(productId: string): Promise<BookDetails | null> {
    if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID')
    const token = await getAccessToken()

    const response: Response = await fetch(
        `${EMPORIX_API_BASE_URL}/product/${EMPORIX_TENANT_ID}/products/${productId}`,
        {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        }
    )

    if (response.status === 404) return null
    if (!response.ok) {
        throw new Error(`Emporix product fetch failed (${response.status}): ${await response.text()}`)
    }

    const product: emporixProductStructure = await response.json()
    const mixin = product.mixins?.[MIXIN_SCHEMA_ID] ?? {}

    const authors: Author[] = (mixin[FIELD.authors] ?? []).map((a: any) => ({
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

//-----------------GET PRICES----------------

//Note on Emporix Price API:
//The endpoint `/prices/{priceId}` requires a specific price ID formatted as `price-${productId}-${index}`
//Querying with a raw `productId` causes 404/400 errors
//Solution:
//We construct the `priceId` using the deterministic pattern set by the importer (`price-${productId}-${index}`)
//Since Emporix's `/prices/{priceId}` endpoint expects a price ID and returns a single JSON object instead of an array,
//we parse the price object directly rather than using `.map()`.
//We increment the index in a loop until a 404 is returned to collect all prices for the given product.

export type PriceDetails = {
    amount: number
    currency: string
    country: string
}

export async function getBookPrices(productId: string): Promise<PriceDetails[]> {
    if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID')
    const token = await getAccessToken()

    const prices: PriceDetails[] = []
    let index = 1

    while (true) {
        const priceId = `price-${productId}-${index}`

        const response = await fetch(
            `${EMPORIX_API_BASE_URL}/price/${EMPORIX_TENANT_ID}/prices/${priceId}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            }
        )

        if (response.status === 404) {
            break
        }

        if (!response.ok) {
            throw new Error(`Emporix price fetch failed (${response.status}): ${await response.text()}`)
        }

        const priceItem = await response.json()

        prices.push({
            amount: priceItem.tierValues[0]?.priceValue ?? 0,
            currency: priceItem.currency,
            country: priceItem.location.countryCode,
        })

        index++
    }

    return prices
}

//---------------GET AVAILABILITY-----------------

export type AvailabilityDetails = {
    stockLevel: number
    available: boolean
    distributionChannel: string
}

export async function getBookAvailability(productId: string, site: string = 'main'): Promise<AvailabilityDetails | null> {
    if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID')
    const token = await getAccessToken()

    const response = await fetch(
        `${EMPORIX_API_BASE_URL}/availability/${EMPORIX_TENANT_ID}/availability/${productId}/${site}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        }
    )

    if (response.status === 404) return null
    if (!response.ok) {
        throw new Error(`Emporix inventory fetch failed (${response.status}): ${await response.text()}`)
    }

    const inventoryData = await response.json()

    return {
        stockLevel: inventoryData.stockLevel,
        available: inventoryData.available,
        distributionChannel: inventoryData.distributionChannel,
    }
}


