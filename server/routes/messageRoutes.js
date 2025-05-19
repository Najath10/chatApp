import express from 'express';
import { protectedRoute } from '../middleware/auth.js';
import { getMessages, getUsersForSideBar, markMessageAsSeen, sendMessage } from '../controller/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/users', protectedRoute,getUsersForSideBar)
messageRouter.get('/:id', protectedRoute,getMessages)
messageRouter.put('/mark/:id', protectedRoute,markMessageAsSeen)
messageRouter.post('/send/:id', protectedRoute,sendMessage)

export default messageRouter;