import express from 'express'
import http from 'http'
import cors from 'cors'
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
import {buildContext} from 'graphql-passport'
import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from '@apollo/server/express4'
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer'
import { configDotenv } from 'dotenv';
import { configPassport } from './passport/passport.js';
import mergeResolver from "./resolvers/index.js";
import mergeTypeDef from "./typedefs/index.js";
import { connectWithDatabase } from './Database/config.js';
configDotenv();
configPassport();
const URL = process.env.MONGO_URL
const app = express();
const httpServer = http.createServer(app);


// session setup =====================================
const MongoStore = connectMongo(session);
const store = new MongoStore({
    uri:URL,
    collection:"sessions"
})

store.on("error",(err)=>console.log(err));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false, 
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24*7,
        httpOnly:true //prevents xss attacks (cross side scripting)
    },
    store:store
}))
//========================================================

app.use(passport.initialize());
app.use(passport.session());

// creating graphQL server =================================================
const server = new ApolloServer({
    typeDefs:mergeTypeDef,
    resolvers:mergeResolver,
    plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
})

await server.start();
// =========================================================================


app.use('/',cors({
    origin:"*",
    credentials:true
}),express.json(),expressMiddleware(server,{
    context:async ({req,res})=>buildContext({req,res}), // shared resource for resolvers
}));

await new Promise((resolve)=>httpServer.listen({port:process.env.PORT},resolve))
await connectWithDatabase()
console.log('server listened at 4000')