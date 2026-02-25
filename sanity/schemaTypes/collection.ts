export const collection = {
    name: 'collection',
    title: 'Collection',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
            },
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'image',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
            description: 'Short subtitle (e.g. "Essentials for the modern man")'
        },
        {
            name: 'filterTag',
            title: 'Filter Tag',
            type: 'string',
            description: 'Exact match for Product Category (e.g. "Knitwear")'
        },
        {
            name: 'products',
            title: 'Legacy Products',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
            hidden: true,
            readOnly: true
        },
        {
            name: 'sizeType',
            title: 'Size Type Filter',
            type: 'string',
            options: {
                list: [
                    { title: 'Clothing (XS-XXL)', value: 'clothing' },
                    { title: 'Footwear (UK 6-12)', value: 'footwear' },
                    { title: 'Numeric (28-36)', value: 'numeric' },
                    { title: 'No Filter', value: 'none' }
                ],
                layout: 'radio'
            },
            initialValue: 'clothing',
            description: 'Determines which size filter buttons appear on the collection page.'
        }
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image'
        }
    }
}
