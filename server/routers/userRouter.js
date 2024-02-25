import express from 'express';
import dotenv from 'dotenv';
import auth from '../middlewares/auth.js';
import UserController from '../controllers/userController.js';
dotenv.config();

const uR = express.Router();

const uC = new UserController();

uR.post('/testing', uC.testing);
uR.post('/send-email', uC.sendEmail);
uR.post('/register', uC.register);
uR.post('/update', uC.update);
uR.post('/login', uC.login);
uR.post('/verify-otp', uC.verifyOtp);
uR.post('/get-user', uC.sendUserInfo);
uR.post('/increase-coins', uC.increaseCoins);
uR.post('/decrease-coins', uC.decreaseCoins);
uR.post('/add-to-inventory', uC.addToInventory);
uR.post('/remove-from-inventory', uC.removeFromInventory);
uR.post('/save-quiz',uC.saveQuizSubmission);
uR.get('/get-inventory', uC.getInventory);
uR.post('/add-task', uC.addTask);
uR.post('/check-quiz',uC.checkPrevSubmission);
uR.get('/get-tasks', uC.getTasks);
uR.post('/set-task-status', uC.setTaskStatus);
uR.post('/delete-task', uC.deleteTask);
uR.post('/set-income',uC.setIncome);
// uR.post('/new-day-task-load', uC.newDayTaskLoad);
uR.get('/get-all-users', uC.getAllUsers);
uR.post('/update-avatar', uC.setAvatar);
// uR.post('/add-friend', uC.addFriend);
uR.post('/update-avatar', uC.setAvatar);
export default uR;