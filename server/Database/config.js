import mongoose from "mongoose";

const connectWithDatabase = ()=>{
    const URL = process.env.MONGO_URL
      mongoose.connect(URL).then((res)=>console.log('Database Connected Successfully')).catch((err)=>{console.log("Error Connecting to Db : \n",err);process.exit(1)})
}

export {connectWithDatabase}