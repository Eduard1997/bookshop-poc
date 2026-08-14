import type { CollectionConfig } from 'payload'
import type { CollectionBeforeValidateHook } from 'payload'
import type { Page } from '@/payload-types'

const beforeValidateHook: CollectionBeforeValidateHook<Page> = async ({
    data
    }) => {
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
        beforeValidate: [
            beforeValidateHook
        ]
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
            admin: {
                description: 'The exact web address for this page (e.g., "about-us" or "contact"). Please do not include spaces.',
            },
            unique: true,

        },
        {
            name: 'content',
            type: 'richText',
            admin: {
                description: 'The main content of the page.',
            },
        }
    ]
}