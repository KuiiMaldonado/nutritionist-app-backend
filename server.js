const {ApolloServer} = require("@apollo/server");
const {expressMiddleware} = require("@apollo/server/express4");
const {ApolloServerPluginDrainHttpServer} = require("@apollo/server/plugin/drainHttpServer");
const express = require('express');
const http = require('http');
const cors = require('cors');
const {json} = require('body-parser');
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
});

async function startApolloServer() {
    await server.start()
    app.use('/graphql', cors(), json(), expressMiddleware(server, {
        context: authMiddleware
    }));
    db.once('open', () => {
        httpServer.listen(PORT, () => {
            console.log(`🚀 Now listening on localhost:${PORT}`);
            console.log(`Use GraphQL at http://localhost:${PORT}/graphql`)
        });
    });
}

startApolloServer();