import type { CollectionConfig } from 'payload'

export const CuratedLists: CollectionConfig = {
    slug: 'curated-lists',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'text',
            name: 'title',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            admin: {
                description: 'A optional description for what the list is about.',
            },
        },
        {
            type: 'array',
            name: 'books',
            fields: [
                {
                    type: 'relationship',
                    name: 'bookOverlay',
                    relationTo: 'book-overlays',
                }
            ]
        }
    ]

}