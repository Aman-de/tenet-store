export const product = {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
            },
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'originalPrice',
            title: 'Original Price',
            type: 'number',
        },
        {
            name: 'discountLabel',
            title: 'Discount Label',
            type: 'string',
            description: 'Optional label like "30% OFF"'
        },
        {
            name: 'variants',
            title: 'Variants',
            type: 'array',
            of: [{
                type: 'object',
                title: 'Variant',
                fields: [
                    {
                        name: 'colorName',
                        title: 'Color Name',
                        type: 'string',
                        validation: (Rule: any) => Rule.required()
                    },
                    {
                        name: 'colorHex',
                        title: 'Color Hex Code',
                        type: 'string',
                        description: 'e.g. #000000',
                        validation: (Rule: any) => Rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                            name: 'hex',
                            invert: false
                        })
                    },
                    {
                        name: 'images',
                        title: 'Variant Images',
                        type: 'array',
                        of: [{ type: 'image' }],
                        options: { hotspot: true }
                    },
                    {
                        name: 'stock',
                        title: 'Stock Quantity',
                        type: 'number',
                        initialValue: 10
                    }
                ],
                preview: {
                    select: {
                        title: 'colorName',
                        media: 'images.0'
                    }
                }
            }]
        },
        {
            name: 'sizeType',
            title: 'Size Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Clothing (S/M/L/XL)', value: 'clothing' },
                    { title: 'Numeric (40/41/42)', value: 'numeric' },
                    { title: 'One Size', value: 'onesize' }
                ],
                layout: 'radio'
            },
            initialValue: 'clothing'
        },
        {
            name: 'sizes',
            title: 'Sizes',
            type: 'array',
            of: [{ type: 'string' }],
            hidden: ({ document }: any) => document?.sizeType === 'onesize'
        },
    ],
}
