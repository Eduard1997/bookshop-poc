import type { CollectionConfig } from 'payload'

export const BookOverlays: CollectionConfig = {
    slug: 'book-overlays',
    admin: {
        useAsTitle: 'isbn',
        defaultColumns: ['isbn', 'staffPick', 'updatedAt'],
    },
    access: {
        read: () => true, 
    },
    fields: [
        {
            type: 'text',
            name: 'isbn',
            required: true,
            unique: true,
            admin: {
                description: 'The ISBN must match the book in emporix.',
            },
        },
        {
            type: 'checkbox',
            name: 'staffPick',
            defaultValue: false,
            label: 'Staff Pick',
            admin: {
                description: 'Check this box if this book is a staff recommendation.',
            },
        },
        {
            type: 'textarea',
            name: 'blurb',
            admin: {
                description: 'A staff written note for the clients to see.',
            },
        },
        {
            required: false,
            name: 'alternativeCoverImage',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: 'Optional — overrides the cover from Emporix if set.',
            },
        }

    ]

}