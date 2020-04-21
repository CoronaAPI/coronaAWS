const schema = `
type Query {
  getCoronaData(handle: String!): String!
}

schema {
  query: Query
}
`
export {schema}