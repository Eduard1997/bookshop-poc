import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPageLayout() {
    const payload = await getPayload({ config })

    const layout = await payload.findGlobal({
        slug: 'page-layout',
    })

    return layout
}