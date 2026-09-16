import type { CollectionConfig } from 'payload'
import type { CollectionBeforeValidateHook } from 'payload'
import type { Page } from '@/payload-types'

const beforeValidateHook: CollectionBeforeValidateHook<Page> = async ({ data }) => {
    if (data?.slug) {
        data.slug = data.slug.toLowerCase().replace(/\s+/g, '-');
    }
    return data;
}

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'updatedAt'],
    },
    access: {
        read: () => true,
    },
    hooks: {
        beforeValidate: [beforeValidateHook]
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'The title of the page to be displayed.',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'The exact web address for this page (e.g., "about-us" or "contact"). Please do not include spaces.',
            },
        },
        {
            name: 'content',
            type: 'richText',
            admin: {
                description: 'A text-based page content.',
            },
        },
        {
            name: 'pageLayout',
            type: 'array',
            label: 'Page Layout Sections',
            admin: {
                description: 'Add, reorder, and remove sections to build your page layout.',
            },
            fields: [
                {
                    name: 'contentBlock',
                    type: 'relationship',
                    relationTo: ['book-overlays', 'curated-lists', 'banners'],
                    required: true,
                    label: 'Select Content',
                    admin: {
                        description: 'Select an existing book, list, or banner to feature in this section.',
                    },
                },
            ],
        },
    ]
}