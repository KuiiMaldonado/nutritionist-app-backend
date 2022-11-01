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

    type Query {
        me: User
        users: [User]!
    }

    type Mutation {
        login(email: String!, password: String!):Auth
        addProfile(username: String!, email: String!, password: String!):User
    }
`;

module.exports = typeDefs;