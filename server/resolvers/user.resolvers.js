import { users } from "../Dummy Data/Data.js";
import bcrypt from 'bcryptjs' 
import User from "../models/user.model.js";
/*
In Query we receive 4 arguments 
1. parent
2. args - contains variables we pass
3. context - context carry data in simple words
4. info
*/
const userResolver = {
	Mutation: {
        signUp:async(_,{input},context)=>{
            try{
                const {username,name,password,gender}= input;
                if(!username || !name || !password ||!gender)
                {
                    throw new Error('All fields are required')
                }
                const existingUser = await User.findOne({username});
                if(existingUser)
                {
                    throw new Error('User Already Exists');
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(password,salt);
                const generateAvatarUrl = `https://avatar.iran.liara.run/public/${gender === "male"?"boy":"girl"}?username=${username}`
                const userCreated = new User({
                    username,
                    name,
                    password:hashedPass,
                    gender,
                    profilePicture:generateAvatarUrl
                })
                await userCreated.save();
                await context.login(userCreated)
                return userCreated;
            }catch(err)
            {
                console.error("Error in  signup : \n",err)
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        login:async(_,input,context)=>{
            try{
                const {username,password} = input;
                const {user} = await context.authenticate('graphql-local',{username,password})
                await context.login(user);
                return user
            }
            catch(err)
            {
                console.error("Error in login :\n",err);
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        logout:async(_,_,context)=>{
            try {
                
                await context.logout();
                req.session.destroy((err)=>{
                    if(err) throw err;
                })
                res.clearCookie("connect.sid")
                return {message:"Logout Successfully "}

            } catch (error) {
                console.error("Error in logout :\n",err);
                throw new Error(err.message || 'Internal Server Error')
            }
        }
        
    },
	Query: {
        authUser : async(_,_,context)=>{
            try {
                const user = await context.getUser();
                return user;
                
            } catch (error) {
                console.error("Error in authUser :\n",err);
                throw new Error(err.message || 'Internal Server Error')
            }
        },
        user:async(_,args,{req,res})=>{
            try {
                const user = await User.findById(args.userId)
                return user
            } catch (error) {
                console.error("Error in user query:\n",err);
                throw new Error(err.message || 'Internal Server Error')
            }
        }
        
    },
	User: {

    },
};

export default userResolver;