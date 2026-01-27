export const review = {
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
        {
            name: 'product',
            title: 'Product',
            type: 'reference',
            to: [{ type: 'product' }],
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'author',
            title: 'Author Name',
            type: 'string',
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'rating',
            title: 'Rating (1-5)',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(1).max(5)
        },
        {
            name: 'comment',
            title: 'Comment',
            type: 'text',
            rows: 3
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'Pending' },
                    { title: 'Approved', value: 'Approved' },
                    { title: 'Rejected', value: 'Rejected' }
                ],
                layout: 'radio'
            },
            initialValue: 'Pending'
        },
        {
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: (new Date()).toISOString()
        }
    ],
    preview: {
        select: {
            title: 'author',
            rating: 'rating',
            status: 'status',
            productTitle: 'product.title'
        },
        prepare({ title, rating, status, productTitle }: any) {
            return {
                title: `${title} (${rating}/5)`,
                subtitle: `${productTitle} - ${status}`
            }
        }
    }
}
