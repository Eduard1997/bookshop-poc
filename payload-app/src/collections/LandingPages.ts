import type { CollectionConfig } from 'payload'

export const LandingPages: CollectionConfig = {
    slug: 'landing-pages',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'Page URL slug',
            },
        },
        {
            name: 'subtitle',
            type: 'textarea',
        },
        {
            name: 'books',
            type: 'array',
            label: 'Recommended Books',
            fields: [
                {
                    name: 'isbn',
                    type: 'text',
                    required: true,
                    label: 'Book ISBN',
                },
                {
                    name: 'editorialReview',
                    type: 'textarea',
                    label: 'Editorial Note / Review',
                },
            ],
        },
    ],
}