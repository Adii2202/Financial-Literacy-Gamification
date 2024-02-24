import express from 'express';
import dotenv from 'dotenv';
import auth from '../middlewares/auth.js';
import GameController from '../controllers/gameController.js';
dotenv.config();

const gR = express.Router();

const gC = new GameController();

// uR.post('/testing', uC.testing);

gR.post('/send_invite', gC.sendInvite);
gR.post('/delete_party', gC.deleteParty);
gR.post('/accept_invite', gC.acceptInvite);
gR.post('/leave_party', gC.leaveParty);
gR.post('/get_party', gC.getParty);
gR.post('/start-fight', gC.startFight);
gR.post('/complete-fight', gC.completeFight);
export default gR;