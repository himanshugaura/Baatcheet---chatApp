import { Router } from 'express';
import { getOnlineStatus } from '../controllers/onlineStatus.controller';

const Onlinerouter = Router();

// Route to get the online status of a user by ID
Onlinerouter.get('/:id/status', getOnlineStatus);

export default Onlinerouter;
