const {ApolloServer} = require('@apollo/server');

const typeDefs = `#graphql
    type User {
        _id: ID!,
        username: String!,
        email: String!,
        password: String!,
        firstName: String!,
        lastName: String!,
        birthDate: String,
        isAdmin: Boolean!
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
    }

    type Query {
        me: User
        users: [User]!
    }

    type Mutation {
        login(email: String!, password: String!):Auth
        addProfile(userInput: updatedProfileInput, isAdmin:Boolean):User
        deleteProfile(userId: String!):User
        updateProfile(userInput: updatedProfileInput):User
    }
`;

module.exports = typeDefs;