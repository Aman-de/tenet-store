import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { review } from './review'
import { collection } from './collection'
import { order } from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, review, collection, order],
}
