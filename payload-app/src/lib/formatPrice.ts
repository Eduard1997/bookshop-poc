export function formatPrice(amount?: number | null, currency?: string | null): string {
    if (amount === null || amount === undefined || Number.isNaN(amount)) {
        return currency ? `— ${currency}` : '—'
    }

    const safeCurrency = currency || 'EUR'

    try {
        const formattedNumber = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)

        return `${formattedNumber} ${safeCurrency}`
    } catch {
        return `${amount.toFixed(2)} ${safeCurrency}`
    }
}