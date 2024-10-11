import Ticket from "../models/tickets.models.js";  

const crearTicket = async (amount, purchaser) => {  
  try {  
   
    if (typeof amount !== 'number' || amount <= 0) {  
      throw new Error('El monto debe ser un número positivo.');  
    }  

    const nuevoTicket = new Ticket({  
      amount,  
      purchaser,  
    });  

    const ticketGuardado = await nuevoTicket.save();  
    console.log('Ticket creado:', ticketGuardado);  
    return ticketGuardado;  
  } catch (error) {  
    console.error('Error al crear el ticket:', error);  
    throw error;   
  }  
};  

export default crearTicket;