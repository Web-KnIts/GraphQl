import passport from "passport"; 
import bcrypt from 'bcryptjs'

import User from '../models/user.model.js'
import { GraphQLLocalStrategy } from "graphql-passport";

export const configPassport = async()=>{
    passport.serializeUser(function(user,done){
        console.log("serializing User...")
        done(null,user.id)
    })

    passport.deserializeUser(async function(id,done) {
        console.log("deserializing User...")
        try{
            const isUser = await User.findById(id);
            done(null,isUser)
        }
        catch(err)
        {
            done(err);
        }
    })
    
    passport.use(
        new GraphQLLocalStrategy(async function(username,password,done){
            try{
                const user =await User.findOne({username})
                if(!user)
                {
                    throw new Error('Invalid Username or Password')
                }
                const validPassword = await bcrypt.compare(password,user.password);
                if(!validPassword)
                {
                    throw new Error('Invalid Username or Password');
                }
                return done(null,user);
            }
            catch(err)
            {
                return  done(err)
            }
        })
    )
}

