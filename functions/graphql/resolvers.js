import { getDynamoData } from '../utils/database'

export const resolvers = {
    Query: {
      getCoronaData: async (root, args) => await getDynamoData()
    }
  };