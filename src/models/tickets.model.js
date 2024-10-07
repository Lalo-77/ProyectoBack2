import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({  
    code: {  
        type: String,  
        unique: true,  
        required: true,  
        default: function() { 
            return`TICKET-${Math.random().toString()}`
        }  
    },  
    purchase_datetime: {  
        type: Date,  
        default: Date.now 
    },  
    amount: {  
        type: Number,  
        required: true  
    },  
    purchaser: {  
        type: String,  
        required: true,  
    }  
});  

const TicketModel = mongoose.model('tickets', ticketSchema);  

export default TicketModel;