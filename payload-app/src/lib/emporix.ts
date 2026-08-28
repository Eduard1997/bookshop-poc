'use server'

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
        cache: 'no-store',
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
    yrn?: string
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
    yrn?: string
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
    console.log(product.yrn)
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
        yrn: product.yrn,  
    }
}

//-----------------GET PRICES----------------

export type PriceDetails = {
    amount: number
    currency: string
    country: string
}

export async function getBookPrices(productId: string): Promise<PriceDetails[]> {
    if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID')
    const token = await getAccessToken()

    const response = await fetch(
        `${EMPORIX_API_BASE_URL}/price/${EMPORIX_TENANT_ID}/prices?q=itemId.id:${productId}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        },
    )

    if (!response.ok) return []

    const priceItem = await response.json()
    const list = Array.isArray(priceItem) ? priceItem : priceItem.results ?? []
    console.log(list)
    return list.map((p: any) => ({
        amount: p.tierValues?.[0]?.priceValue ?? 0,
        currency: p.currency ?? 'EUR',
        country: p.location.countryCode,
    }))
}

//---------------GET AVAILABILITY-----------------

export type AvailabilityDetails = {
    stockLevel: number
    available: boolean
    distributionChannel: string
}

export async function getBookAvailability(productId: string, site: string = 'bookshop-site'): Promise<AvailabilityDetails | null> {
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

//------------------GET CATEGORIES--------------------------

export async function getCategoriesWithNamesForCatalog(catalogId: string) {
    if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID');
    const token = await getAccessToken();

    const catalogUrl = `${EMPORIX_API_BASE_URL}/catalog/${EMPORIX_TENANT_ID}/catalogs/${catalogId}`;
    const catalogRes = await fetch(catalogUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!catalogRes.ok) return [];

    const catalogData = await catalogRes.json();
    const categoryIds: string[] = catalogData.categoryIds || [];

    if (categoryIds.length === 0) return [];

    const categoryPromises = categoryIds.map(async (catId) => {
        const catUrl = `${EMPORIX_API_BASE_URL}/category/${EMPORIX_TENANT_ID}/categories/${catId}`;
        const catRes = await fetch(catUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });

        if (!catRes.ok) return null;
        return await catRes.json();
    });

    const categories = await Promise.all(categoryPromises);

    return categories.filter(Boolean);
}

//----------------------GET BOOKS---------------------------
export async function getProductsByCategory(categoryId: string) {
    if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID');
    const token = await getAccessToken();

    const url = `${EMPORIX_API_BASE_URL}/category/${EMPORIX_TENANT_ID}/categories/${categoryId}/assignments`;

    const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) return [];

    const data = await res.json();
    const assignments = data.content || data.assignments || data || [];

    const productPromises = assignments.map(async (assignment: any) => {
        const prodId = assignment.ref?.id || assignment.productId || assignment.product?.id;
        if (!prodId) return null;

        return await getBookById(prodId);
    });

    const products = await Promise.all(productPromises);
    return products.filter(Boolean);
}
//----------------------GET ALL PRODUCTS FROM CATALOG VIA CATEGORIES---------------------------
export async function getAllProductsFromCatalogViaCategories(catalogId: string): Promise<BookDetails[]> {
    try {
        const categories = await getCategoriesWithNamesForCatalog(catalogId);
        if (!categories || categories.length === 0) return [];

        let allProducts: BookDetails[] = [];

        for (const cat of categories) {
            const categoryId = cat?.id;
            if (!categoryId) continue;

            const productsInCat = await getProductsByCategory(categoryId);
            allProducts.push(...(productsInCat as BookDetails[]));
        }

        const uniqueProducts = Array.from(
            new Map(allProducts.filter(p => p && p.id).map(p => [p.id, p])).values()
        );

        return uniqueProducts;
    } catch (error) {
        return [];
    }
}
//----------------GET PRODUCTS BY ISBN-----------------------------
export async function getBookByISBN(isbn: string): Promise<BookDetails | null> {
    if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID')
    const token = await getAccessToken()

    const response: Response = await fetch(
        `${EMPORIX_API_BASE_URL}/product/${EMPORIX_TENANT_ID}/products?q=code:${isbn}`,
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

    const data = await response.json()
    const list: emporixProductStructure[] = Array.isArray(data) ? data : data.results ?? []

    const product = list.find((p) => p.code === isbn) ?? list[0]
    if (!product) return null
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

//----------------CREATE CART-----------------------------
export async function createCart(sessionId: string): Promise<string | null> {
    try {
        if (!EMPORIX_TENANT_ID) {
            console.error('Missing EMPORIX_TENANT_ID');
            return null;
        }
        const token = await getAccessToken();

        const url = `${EMPORIX_API_BASE_URL}/cart/${EMPORIX_TENANT_ID}/carts`;

        const res = await fetch(url, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${token}`,
                'session-id': sessionId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                siteCode: 'bookshop-site',
                currency: 'EUR'
            }),
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Emporix API Error (${res.status}):`, await res.text());
            return null;
        }

        const data = await res.json();
        return data.cartId || data.id;

    } catch (error) {
        console.error("Internal Server Error:", error);
        return null;
    }
}

//----------------GET CART-----------------------------
export async function getCart(bookshop_cart_id: string) {
    try {
        if (!EMPORIX_TENANT_ID) {
            console.error('Missing EMPORIX_TENANT_ID');
            return null;
        }
        const token = await getAccessToken();

        const url = `${EMPORIX_API_BASE_URL}/cart/${EMPORIX_TENANT_ID}/carts/${bookshop_cart_id}?expandCalculation=true`;

        const res = await fetch(url, {
            method: 'GET',
            headers: { 
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Emporix API Error (${res.status}):`, await res.text());
            return null;
        }

        const data = await res.json();

        return {
            id: data.id,
            yrn: data.yrn || '',
            currency: data.currency || 'EUR',
            sessionId: data.sessionId || '',
            totalPrice: data.calculatedPrice?.finalPrice?.grossValue || data.totalPrice?.amount || 0,
            items: (data.items || []).map((item: any) => ({
                id: item.id,
                itemYrn: item.itemYrn,
                quantity: item.quantity,
                effectiveQuantity: item.effectiveQuantity,
                price: {
                    priceId: item.price?.priceId || '',
                    originalAmount: item.price?.originalAmount || 0,
                    effectiveAmount: item.price?.effectiveAmount || 0,
                    currency: item.price?.currency || 'EUR'
                }
            }))
        };

    } catch (error) {
        console.error("Internal Server Error:", error);
        return null;
    }
}


//----------------ADD ITEM TO CART-----------------------------
export async function addToCart(
    cartId: string, 
    itemYrn: string, 
    priceId: string, 
    priceAmount: number, 
    quantity: number = 1
) {
    try{
        if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID');
        const token = await getAccessToken();

        const url = `${EMPORIX_API_BASE_URL}/cart/${EMPORIX_TENANT_ID}/carts/${cartId}/items?siteCode=bookshop-site`;

        const res = await fetch(url, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                itemYrn: itemYrn,
                price: {
                    priceId: priceId,
                    effectiveAmount: priceAmount,
                    originalAmount: priceAmount,
                    currency: 'EUR'
                },
                quantity: quantity
            }),
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Emporix API Error (${res.status}):`, await res.text());
            return { error: 'Failed to add item to cart' };
        }

        return await res.json();
    }
    catch (error){
        console.error("Internal Server Error:", error);
        return { error: 'An unexpected error occurred' };
    }
}

//----------------UPDATE ITEM-----------------------------
export async function updateCartItem(
    itemId: string,
    cartId: string, 
    itemYrn: string, 
    priceId: string, 
    priceAmount: number, 
    quantity: number = 1
) {
    try{
        if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID');
        const token = await getAccessToken();

        const url = `${EMPORIX_API_BASE_URL}/cart/${EMPORIX_TENANT_ID}/carts/${cartId}/items/${itemId}`;

        const res = await fetch(url, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                itemYrn: itemYrn,
                price: {
                    priceId: priceId,
                    effectiveAmount: priceAmount,
                    originalAmount: priceAmount,
                    currency: 'EUR'
                },
                quantity: quantity
            }),
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Emporix API Error (${res.status}):`, await res.text());
            return { error: 'Failed to update item from cart' };
        }

        return await res.json();

    } catch (error) {
        console.error("Internal Server Error:", error);
        return { error: 'An unexpected error occurred' };
    }

}





//----------------DELETE ITEM FROM CART-----------------------------
export async function removeCartItem(cartId: string, itemId: string) {
    try{
        if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID');
        const token = await getAccessToken();

        const url = `${EMPORIX_API_BASE_URL}/cart/${EMPORIX_TENANT_ID}/carts/${cartId}/items/${itemId}`;

        const res = await fetch(url, {
            method: 'DELETE',
            headers: { 
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Emporix API Error (${res.status}):`, await res.text());
            return { error: 'Failed to delete item from cart' };
        }

        return res.status

    } catch (error) {
        console.error("Internal Server Error:", error);
        return { error: 'An unexpected error occurred' };
    }
}


//----------------CLEAR CART----------------------------
export async function clearCart(cartId: string){
    try{
        if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID');
            const token = await getAccessToken();

            const url = `${EMPORIX_API_BASE_URL}/cart/${EMPORIX_TENANT_ID}/carts/${cartId}/items`;

            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 
                    Authorization: `Bearer ${token}`,
                },
                cache: 'no-store'
            });

            if (!res.ok) {
                console.error(`Emporix API Error (${res.status}):`, await res.text());
                return { error: 'Failed to clear cart' };
            }

            return res.status
        
    }catch (error) {
        console.error("Internal Server Error:", error);
        return { error: 'An unexpected error occurred' };
    }
}


export async function createOrder(orderPayload: any) {
    try {
        console.log("2. SERVER PAYLOAD:", JSON.stringify(orderPayload, null, 2));
        if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID');
        const token = await getAccessToken();

        const url = `${EMPORIX_API_BASE_URL}/checkout/${EMPORIX_TENANT_ID}/checkouts/order`;

        const res = await fetch(url, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(orderPayload),
            cache: 'no-store'
        });

        if  (!res.ok) {
            console.error(`Emporix API Error (${res.status}):`, await res.text());
            return { error: 'Failed to create order' };
        }

        const data = await res.json();
        return data.orderId;
    }
    catch (error) {
        console.error("Internal Server Error:", error);
        return { error: 'An unexpected error occurred' };
    }
}

export async function getOrder(orderId: string) {
    try {
        if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID');
        const token = await getAccessToken();

        const url = `${EMPORIX_API_BASE_URL}/order-v2/${EMPORIX_TENANT_ID}/salesorders/${orderId}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Emporix API Error (${res.status}):`, await res.text());
            return { error: 'Failed to get order' };
        }

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Internal Server Error:", error);
        return { error: 'An unexpected error occurred' };
    }

}

//----------------UPDATE CART ROOT (ADDRESS & SHIPPING)-----------------------------
export async function updateCartRoot(cartId: string, addressData: any) {
    try {
        if (!EMPORIX_TENANT_ID) throw new Error('Missing EMPORIX_TENANT_ID');
        const token = await getAccessToken();

        const url = `${EMPORIX_API_BASE_URL}/cart/${EMPORIX_TENANT_ID}/carts/${cartId}`;

        const res = await fetch(url, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                currency: 'EUR',
                countryCode: 'DE',
                zipCode: addressData.zipCode || '70173',
                addresses: [
                    {
                        type: 'SHIPPING',
                        contactName: addressData.contactName || 'Test Guest',
                        street: addressData.street || 'Fritz-Elsaas',
                        streetNumber: addressData.streetNumber || '20',
                        city: addressData.city || 'Stuttgart',
                        zipCode: addressData.zipCode || '70173',
                        country: 'DE'
                    },
                    {
                        type: 'BILLING',
                        contactName: addressData.contactName || 'Test Guest',
                        street: addressData.street || 'Fritz-Elsaas',
                        streetNumber: addressData.streetNumber || '20',
                        city: addressData.city || 'Stuttgart',
                        zipCode: addressData.zipCode || '70173',
                        country: 'DE'
                    }
                ]
            }),
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Emporix API Error (${res.status}):`, await res.text());
            return { error: 'Failed to update root cart address' };
        }
            const text = await res.text();
            return text ? JSON.parse(text) : { success: true };
    } catch (error) {
        console.error("Internal Server Error:", error);
        return { error: 'An unexpected error occurred' };
    }
}

// fetch ('api/cart' , {
//     method : 'POST',
//     headers : {'Content-Type' : 'application/json'},
//     body: JSON.stringify({
//     itemYrn:"urn:yaas:saasag:caasproduct:product:ant2;6a902b994e1ed05cfb7aa47e",
//     priceId: "price-6a902b994e1ed05cfb7aa47e-2",
// priceAmount: 20.00,
//     quantity: 1
//     })
// }).then(res => res.json())
// .then(data => console.log(data))