import mongoose from "mongoose";
import { v4 as uuidv4 } from  "uuid"; 

// Definición del esquema del Ticket  
const ticketSchema = new mongoose.Schema({  
  code: {  
    type: String,  
    unique: true,  
    default: () => uuidv4(), // Genera un código único automáticamente  
  },  
  purchase_datetime: {  
    type: Date,  
    default: Date.now, // Guarda la fecha y hora exacta de la compra  
  },  
  amount: {  
    type: Number,  
    required: true, // Campo requerido  
  },  
  purchaser: {  
    type: String,  
    required: true, // Campo requerido para el correo del usuario  
    validate: {  
      validator: function(v) {  
        // Valida que el formato del correo sea correcto  
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);  
      },  
      message: props => `${props.value} no es un correo válido!`,  
    },  
  },  
});  

// Crear el modelo a partir del esquema  
const Ticket = mongoose.model('Ticket', ticketSchema);  

export default Ticket;