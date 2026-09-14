import type { GlobalConfig } from 'payload'

export const PageLayout: GlobalConfig = {
    slug: 'page-layout',
    label: 'Book List Page Layout',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'cardsPerRow',
            type: 'select',
            label: 'Cards per row',
            required: true,
            defaultValue: '3',
            options: [
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
            ],
        },
        {
            name: 'defaultSort',
            type: 'select',
            label: 'Default sort order',
            required: true,
            defaultValue: 'title-asc',
            options: [
                { label: 'Title (A-Z)', value: 'title-asc' },
                { label: 'Title (Z-A)', value: 'title-desc' },
            ],
        },
        {
            name: 'visibleFilters',
            type: 'select',
            label: 'Filters shown to users',
            hasMany: true,
            defaultValue: ['category'],
            options: [
                { label: 'Category', value: 'category' },
            ],
        },
        {
            name: 'cardStyle',
            type: 'radio',
            label: 'Card style',
            required: true,
            defaultValue: 'compact',
            options: [
                { label: 'Compact', value: 'compact' },
                { label: 'Detailed', value: 'detailed' },
            ],
        },
    ],
}