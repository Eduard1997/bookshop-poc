import { createCustomer } from '@/lib/emporix';
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  hooks: {
    beforeChange: [
                async ({ data, operation }) => {
                    if (operation === 'create') {
                        const customerId = await createCustomer(data.email);
                        if (!customerId) {
                            throw new Error('Failed to create customer');
                        }
                        data.customerId = customerId;
                    }
                    return data;
                }
            ],
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {name: 'customerId', type: 'text', admin: {hidden: true}},
  ],
}
