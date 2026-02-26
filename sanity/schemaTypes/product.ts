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
            name: 'gender',
            title: 'Gender',
            type: 'string',
            options: {
                list: [
                    { title: 'Men', value: 'man' },
                    { title: 'Women', value: 'woman' },
                    { title: 'Unisex', value: 'unisex' }
                ],
                layout: 'radio'
            },
            initialValue: 'man'
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Knitwear', value: 'knitwear' },
                    { title: 'Shirting', value: 'shirting' },
                    { title: 'Trousers', value: 'trousers' },
                    { title: 'Shorts', value: 'shorts' },
                    { title: 'Swimwear', value: 'swimwear' },
                    { title: 'Outerwear', value: 'outerwear' },
                    { title: 'Footwear', value: 'footwear' },
                    { title: 'Accessories', value: 'accessories' },
                    { title: 'Jackets', value: 'jackets' },
                    { title: 'Sets', value: 'sets' },
                    { title: 'Shirts', value: 'shirts' },
                    { title: 'Exclusive', value: 'exclusive' }
                ]
            },
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'isOutOfStock',
            title: 'Out of Stock',
            type: 'boolean',
            description: 'Enable to mark this product as out of stock',
            initialValue: false
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3
        },
        {
            name: 'imagePromptNote',
            title: 'Image Prompt Note',
            type: 'text',
            rows: 2,
            description: 'Internal note for image generation prompts'
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
        {
            name: 'pairsWellWith',
            title: 'Pairs Well With',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
            description: 'Select products that pair well with this item'
        }
    ],
}
