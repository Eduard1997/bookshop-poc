import { getBookByISBN,  putBook, } from '@/lib/emporix'
import { FIELD, MIXIN_SCHEMA_ID } from '@/lib/emporix.constants'
import type { CollectionConfig } from 'payload'

export const BookOverlays: CollectionConfig = {
    slug: 'book-overlays',
    hooks:{
        afterChange:[
            async ({doc,previousDoc,operation}) => {
                let titleChanged = false
                if(operation === 'create'){
                    titleChanged = doc.title.length > 0
                }
                if(operation === 'update'){
                    titleChanged = doc.title !== previousDoc.title
                }

                if(titleChanged){
                    const book = await getBookByISBN(doc.isbn)

                    if (!book) {
                        console.error(`No Emporix product found for ISBN ${doc.isbn}`)
                        return doc
                    }

                    const language = book.language ?? 'en'

                    const name_dict = { [language]: doc.title }
                    if (book.language != "en") {
                        name_dict["en"] = doc.title
                    }

                    const newBook = {
                        name: name_dict,
                        code: book.isbn,
                        description: {
                            [language]: book.description,
                        },
                        published: true,
                        productType: 'BASIC',

                        taxClasses: {
                            DE: 'STANDARD',
                        },

                        mixins: {
                            [MIXIN_SCHEMA_ID]: {
                                [FIELD.authors]: (book.authors ?? []).map((person) => ({
                                    [FIELD.authorRole]: person.role,
                                    [FIELD.authorName]: person.name,
                                })),
                                [FIELD.publisher]: book.publisher,
                                [FIELD.publicationDate]: book.publicationDate,
                                [FIELD.subtitle]: book.subtitle,
                                [FIELD.category]: book.category,
                                [FIELD.language]: book.language,
                                [FIELD.pageCount]: book.pageCount,
                                [FIELD.productForm]: book.productForm,
                            },
                        },

                        metadata: {
                            mixins: {
                                [MIXIN_SCHEMA_ID]:
                                    'https://res.cloudinary.com/saas-ag/raw/upload/schemata2/ant2/6a6b3582e7cadf3c8a834e15_v5.json',
                            },
                            schema: 'https://res.cloudinary.com/saas-ag/raw/upload/v1544786405/schemata/CAAS/product.v2',
                        },
                    }
                    await putBook(book?.id, newBook)
                }
                return doc
            }
        ]
    },
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
        },
        {
            type: 'text',
            name: 'title',
            admin: {
                description: 'The title of the book.',
            },
        }

    ]

}