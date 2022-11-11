const {ApolloServer} = require('@apollo/server');

const typeDefs = `#graphql
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        birthDate: String
        isAdmin: Boolean!
        userMeasures: [Measure]
    }

    type Measure {
        _id: ID!
        date: String!
        weight: String!
        bodyFatPercentage: String!
        leanBodyWeight: String!
        bodyFat: String!
        bodyType: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    input updatedProfileInput {
        username: String
        email: String
        firstName: String
        lastName: String
        password: String
        isAdmin: Boolean
    }

    type Query {
        me: User
        user(userId: ID): User!
        users: [User]!
    }

    type Mutation {
        login(email: String!, password: String!):Auth
        addProfile(userInput: updatedProfileInput):User
        deleteProfile(userId: String!):User
        updateProfile(userInput: updatedProfileInput):User
    }
`;

module.exports = typeDefs;