import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { BookOverlays } from './collections/BookOverlays'
import { Pages } from './collections/Pages'
import { CuratedLists } from './collections/CuratedLists'
import { LandingPages } from './collections/LandingPages'

import { PageLayout } from './globals/PageLayout'
import { Banners } from './collections/Banners'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Store Admin',
      icons: [
        {
          rel: 'icon',
          url: '/favicon.ico',
        },
      ],
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Branding#Logo',
        Icon: '@/components/admin/Branding#Icon',
      },
      views: {
        dashboard: {
          Component: '@/components/admin/Dashboard#CustomDashboard',
        },
      },
    },
  },
  collections: [Users, Customers, Media, BookOverlays, Pages, CuratedLists, LandingPages, Banners
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
  globals: [PageLayout],
})