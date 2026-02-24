import { defineField, defineType } from 'sanity'

export const order = defineType({
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        defineField({
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
        }),
        defineField({
            name: 'stripePaymentId',
            title: 'Stripe Payment ID',
            type: 'string',
        }),
        defineField({
            name: 'products',
            title: 'Products',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'product',
                            type: 'reference',
                            to: [{ type: 'product' }],
                        },
                        {
                            name: 'quantity',
                            type: 'number',
                        },
                        {
                            name: 'size',
                            type: 'string',
                        },
                        {
                            name: 'color',
                            type: 'string',
                        }
                    ],
                },
            ],
        }),
        defineField({
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Processing', value: 'processing' },
                    { title: 'Shipped', value: 'shipped' },
                    { title: 'Delivered', value: 'delivered' },
                    { title: 'Cancelled', value: 'cancelled' },
                ],
                layout: 'radio',
            },
            initialValue: 'pending',
        }),
        defineField({
            name: 'shippingAddress',
            title: 'Shipping Address',
            type: 'text', // Using text for simplicity, or object for structured address
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: (new Date()).toISOString()
        })
    ],
})
