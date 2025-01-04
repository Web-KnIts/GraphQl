import { alltransactions } from "../Dummy Data/Data.js";
import Transaction from '../models/transaction.model.js'
const transactionResolver = {
	Query: {
        transactions:async(_,_,context)=>{
           try{
            if(!context.getUser())
            {
                throw new Error('Unauthorized');    
            }
            const userId = await context.getUser()._id;
            const transactions = await Transaction.find({user:userId});
            return transactions;
           }catch(err)
           {
            console.error("Error getting transactions:\n",err);
            throw new Error(err.message || 'Internal Server Error')
           }
        },
        transaction:async(_,{transactionId},context)=>{
            try{
                const transaction = await Transaction.findById(transactionId);
                return transaction 
            }catch(err)
            {
                console.error("Error getting transaction:\n",err);
                throw new Error(err.message || 'Internal Server Error')
            }
        }
    },
	Mutation: {},
	Transaction: {},
};

export default transactionResolver;