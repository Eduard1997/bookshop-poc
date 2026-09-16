import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
    slug: 'banners',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'isActive', 'updatedAt'],
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
                description: 'The internal name for this banner.',
            },
        },
        {
            type: 'checkbox',
            name: 'isActive',
            defaultValue: true,
            label: 'Active',
        },
        {
            type: 'text',
            name: 'heading',
            admin: {
                description: 'The main text displayed on the banner.',
            },
        },
        {
            type: 'textarea',
            name: 'subheading',
            admin: {
                description: 'Optional smaller text to display below the main heading.',
            },
        },
        {
            type: 'text',
            name: 'link',
            admin: {
                description: 'An optional URL where the banner should take the user when clicked.',
            },
        },
        {
            name: 'featuredBook',
            type: 'relationship',
            relationTo: 'book-overlays',
            admin: {
                description: 'Select the book this banner promotes.',
            },
        }
    ]
}