const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',]

export function formatOnixDate(raw?: string | null): string {
    if (!raw) return 'N/A'

    const value = String(raw).trim()
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (isoMatch) {
        return formatFullDate(isoMatch[1], isoMatch[2], isoMatch[3])
    }

    if (/^\d+$/.test(value)) {
        if (value.length === 4) {
            return value
        }
        if (value.length === 6) {
            const year = value.slice(0, 4)
            const month = value.slice(4, 6)
            return formatMonthYear(year, month)
        }
        if (value.length === 8) {
            const year = value.slice(0, 4)
            const month = value.slice(4, 6)
            const day = value.slice(6, 8)
            return formatFullDate(year, month, day)
        }
    }

    return value
}

function formatMonthYear(year: string, month: string): string {
    const monthIndex = parseInt(month, 10) - 1
    const monthName = MONTH_NAMES[monthIndex]
    if (!monthName) return `${year}`
    return `${monthName} ${year}`
}

function formatFullDate(year: string, month: string, day: string): string {
    const monthIndex = parseInt(month, 10) - 1
    const monthName = MONTH_NAMES[monthIndex]
    const dayNumber = parseInt(day, 10)
    if (!monthName || Number.isNaN(dayNumber)) return `${year}`
    return `${monthName} ${dayNumber}, ${year}`
}