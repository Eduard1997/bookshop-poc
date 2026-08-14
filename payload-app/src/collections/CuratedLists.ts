import type { CollectionConfig } from 'payload'

export const CuratedLists: CollectionConfig = {
    slug: 'curated-lists',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'updatedAt'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'text',
            name: 'title',
            required: true,
            unique: true,
            admin: {
                description: 'The name for this list.',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            admin: {
                description: 'An optional description for what the list is about.',
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
            ],
            admin: {
                description: 'The books that are part of this list.',
            },
        }
    ]

}