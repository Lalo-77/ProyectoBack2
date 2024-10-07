const Ticket = ('../models/Ticket');  

const createTicket = async (amount, purchaser) => {  
    const ticket = new Ticket({  
        amount,  
        purchaser  
    });  
    return await ticket.save();  
};  

export default  createTicket;