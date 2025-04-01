export const typeDefs = `
  type User {
    id: ID!
    email: String!
    password: String!
    runningRecords: [RunningRecord!]
  }

  type RunningRecord {
    id: ID!
    distance: Float!
    duration: Int!
    pace: Float!
    heartRate: Int!
    date: String!
    userId: ID!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    runningRecords: [RunningRecord!]!
    runningRecord(id: ID!): RunningRecord
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createRunningRecord(distance: Float!, duration: Int!, pace: Float!, heartRate: Int!, date: String!): RunningRecord!
    deleteRunningRecord(id: ID!): Boolean!
  }
`;