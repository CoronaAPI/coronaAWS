const schema = `
type Maintainers {
  name: String
  country: String
  github: String
  flag: String
  email: String
}

type Sources {
  name: String
  url: String
}

type DailyCoronaData {
  county: String
  aggregate: String
  rating: Float
  stateId: String
  population: Int
  featureId: String
  url: String
  country: String
  name: String
  state: String
  date: String
  updated: String
  level: String
  cases: Int,
  deaths: Int
  active: Int
  recovered: Int
  countryId: String
  ID: String
  populationDensity: Float
  countyId: String
  coordinates: [Float]
  maintainers: [Maintainers]
  sources: [Sources]
  tz: [String]
}

type Query {
  getCoronaData: [DailyCoronaData]
}

schema {
  query: Query
}
`
export {schema}