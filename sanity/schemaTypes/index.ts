import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { review } from './review'
import { collection } from './collection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, review, collection],
}
