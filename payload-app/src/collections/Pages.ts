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
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,

        },
        {
            name: 'content',
            type: 'richText',
        }
    ]
}