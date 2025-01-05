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
	Mutation: {
        createTransaction :async(_,{input},context)=>{
            try{

                const newTransaction = new Transaction({
                    ...input,
                    userId:context.getUser()._id
                })
                await newTransaction.save();
                return newTransaction;
            }catch(err)
            {
                console.log("Error creating Transaction: \n",err)
                throw new Error(err.message ||'Error creating transaction')
            }
        },
        updateTransaction :async(_,{input},context)=>{
            try {     
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true})
                return updatedTransaction
            } catch (error) {
                console.log("Error updating Transaction: \n",err)
                throw new Error(err.message ||'Error updating transaction')
            }
        },
        deleteTransaction :async(_,{transactionId},context)=>{
            try{
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            }
            catch(err)
            {
                console.log("Error deleting Transaction: \n",err)
                throw new Error(err.message ||'Error deleting transaction')
            }
        }
    },
	Transaction: {},
};

export default transactionResolver;