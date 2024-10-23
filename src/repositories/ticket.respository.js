import TicketModel from "../models/ticket.model.js";

class TicketRepository {
    async createTicket(ticketData) {
        const ticket = new TicketModel(ticketData);
        return await ticket.save();
    }
}

export default new TicketRepository();
