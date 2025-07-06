import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/chat.controller.js';

const chatRouter = Router();

// GET /chat/messages/:senderId/:receiverId
chatRouter.get('/messages/:senderId/:receiverId', getMessages);

// POST /chat/message
chatRouter.post('/message', sendMessage);

export default chatRouter;
