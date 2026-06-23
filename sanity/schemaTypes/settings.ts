import { defineField, defineType } from 'sanity'

export const settings = defineType({
    name: 'settings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Site Title',
            type: 'string',
            initialValue: 'TENET',
        }),
        defineField({
            name: 'womanAccentColor',
            title: 'Women Accent Color',
            type: 'string',
            initialValue: '#FF4D6D',
        }),
        defineField({
            name: 'manAccentColor',
            title: 'Men Accent Color',
            type: 'string',
            initialValue: '#2E5B82',
        }),
        defineField({
            name: 'womanBgColorLight',
            title: 'Women Light Background Color',
            type: 'string',
            initialValue: '#FDFBF7',
        }),
        defineField({
            name: 'womanBgColorDark',
            title: 'Women Dark Background Color',
            type: 'string',
            initialValue: '#160F11',
        }),
        defineField({
            name: 'manBgColorLight',
            title: 'Men Light Background Color',
            type: 'string',
            initialValue: '#F4F6F9',
        }),
        defineField({
            name: 'manBgColorDark',
            title: 'Men Dark Background Color',
            type: 'string',
            initialValue: '#0E1217',
        }),
    ],
})
