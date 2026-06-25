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
            name: 'isBestSeller',
            title: 'Is Best Seller?',
            type: 'boolean',
            description: 'Check this to feature the product in the Best Sellers section on the home page.',
            initialValue: false
        },
        {
            name: 'bestSellerRank',
            title: 'Best Seller Rank',
            type: 'number',
            description: 'Order of appearance in Best Sellers (e.g. 1 will show up first). Lower numbers appear first.',
            hidden: ({ document }: any) => !document?.isBestSeller
        },
        {
            name: 'apparelType',
            title: 'Apparel Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Top', value: 'top' },
                    { title: 'Bottom', value: 'bottom' },
                    { title: 'Set', value: 'set' },
                    { title: 'Footwear', value: 'footwear' },
                    { title: 'Accessory', value: 'accessory' }
                ],
                layout: 'radio'
            },
            description: 'Classify whether this product is a top, bottom, set, footwear, or accessory.'
        },
        {
            name: 'enableSetComponents',
            title: 'Enable Individual Component Buying',
            type: 'boolean',
            description: 'Allow customers to buy top-only, bottom-only, or full set from the product page.',
            initialValue: false,
            hidden: ({ document }: any) => document?.apparelType !== 'set'
        },
        {
            name: 'topPrice',
            title: 'Top Only Price (INR)',
            type: 'number',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
        },
        {
            name: 'topOriginalPrice',
            title: 'Top Only Original Price (INR)',
            type: 'number',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
        },
        {
            name: 'bottomPrice',
            title: 'Bottom Only Price (INR)',
            type: 'number',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
        },
        {
            name: 'bottomOriginalPrice',
            title: 'Bottom Only Original Price (INR)',
            type: 'number',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
        },
        {
            name: 'setPrice',
            title: 'Full Set Price (INR)',
            type: 'number',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
        },
        {
            name: 'setOriginalPrice',
            title: 'Full Set Original Price (INR)',
            type: 'number',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
        },
        {
            name: 'topName',
            title: 'Top Custom Name',
            type: 'string',
            description: 'Custom name for the top (e.g. "The Linen Shirt"). Defaults to "Top Only".',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
        },
        {
            name: 'topImages',
            title: 'Top Only Images',
            type: 'array',
            of: [{ type: 'image' }],
            options: { hotspot: true },
            description: 'Images to show when the Top component is selected.',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
        },
        {
            name: 'bottomName',
            title: 'Bottom Custom Name',
            type: 'string',
            description: 'Custom name for the bottom (e.g. "The Trousers"). Defaults to "Bottom Only".',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
        },
        {
            name: 'bottomImages',
            title: 'Bottom Only Images',
            type: 'array',
            of: [{ type: 'image' }],
            options: { hotspot: true },
            description: 'Images to show when the Bottom component is selected.',
            hidden: ({ document }: any) => !document?.enableSetComponents || document?.apparelType !== 'set'
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
                        title: 'Color',
                        type: 'color',
                        description: 'Select the primary (or top) color visually'
                    },
                    {
                        name: 'secondaryColorHex',
                        title: 'Secondary Color',
                        type: 'color',
                        description: 'Select the bottom color for two-tone sets',
                        hidden: ({ document }: any) => document?.apparelType !== 'set'
                    },
                    {
                        name: 'onlyAvailableAsSet',
                        title: 'Only Available as Full Set',
                        type: 'boolean',
                        description: 'Check this if this variant should NOT be sold individually as a Top or Bottom',
                        initialValue: false,
                        hidden: ({ document }: any) => document?.apparelType !== 'set'
                    },
                    {
                        name: 'images',
                        title: 'Variant Set Images',
                        type: 'array',
                        of: [{ type: 'image' }],
                        options: { hotspot: true }
                    },
                    {
                        name: 'topImages',
                        title: 'Variant Top Only Images',
                        type: 'array',
                        of: [{ type: 'image' }],
                        options: { hotspot: true }
                    },
                    {
                        name: 'bottomImages',
                        title: 'Variant Bottom Only Images',
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
