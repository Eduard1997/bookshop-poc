import type { CollectionConfig } from 'payload'

/**
 * Editorial overlay on a book, keyed by ISBN.
 *
 * This collection deliberately does NOT store price, stock, or title —
 * those live in Emporix and are the single source of truth for them.
 * This only holds what a human editor adds on top: a hand-written blurb,
 * a staff-pick flag, an alternative cover. See brief section 3.
 */
export const BookOverlays: CollectionConfig = {
  slug: 'book-overlays',
  admin: {
    useAsTitle: 'isbn',
    defaultColumns: ['isbn', 'staffPick', 'updatedAt'],
  },
  access: {
    read: () => true, // public read — the storefront fetches this via Local API
  },
  fields: [
    {
      name: 'isbn',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Must match the ISBN (product code) in Emporix exactly.',
      },
    },
    {
      name: 'staffPick',
      type: 'checkbox',
      label: 'Staff pick',
      defaultValue: false,
    },
    {
      name: 'blurb',
      type: 'textarea',
      label: 'Editor\u2019s note',
      admin: {
        description: 'A short, hand-written note — not the Emporix product description.',
      },
    },
    {
      name: 'alternativeCover',
      type: 'upload',
      relationTo: 'media',
      label: 'Alternative cover image',
      admin: {
        description: 'Optional — overrides the cover from Emporix if set.',
      },
    },
  ],
}
