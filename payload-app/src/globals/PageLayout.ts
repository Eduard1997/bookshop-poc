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
            name: 'filters',
            type: 'array',
            label: 'Filters',
            admin: {
                description: 'Drag to reorder how filters appear. Uncheck to hide a filter without removing it.',
            },
            defaultValue: [
                { filterType: 'category', enabled: true },
                { filterType: 'author', enabled: true },
                { filterType: 'priceRange', enabled: false },
            ],
            fields: [
                {
                    name: 'filterType',
                    type: 'select',
                    label: 'Filter',
                    required: true,
                    options: [
                        { label: 'Category', value: 'category' },
                        { label: 'Author', value: 'author' },
                        { label: 'Price range', value: 'priceRange' },
                    ],
                },
                {
                    name: 'enabled',
                    type: 'checkbox',
                    label: 'Show this filter',
                    defaultValue: true,
                },
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