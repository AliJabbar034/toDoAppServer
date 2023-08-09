import express from 'express';
import { addTask,  forgetPassword, getMyProfile, logOut, login, register, removeTask, resetPassword, updatePassword, updateProfile, updateTask, verify, welcom } from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(welcom);
router.route('/register').post(register);

router.route('/verify').post(isAuthenticated ,verify)
router.route('/login').post(login);

router.route('/logout').get(logOut); 

router.route('/newTask').post(isAuthenticated,addTask);

router.route ('/task/:taskId').get(isAuthenticated,updateTask)
.delete(isAuthenticated,removeTask);

router.route('/me').get(isAuthenticated,getMyProfile)

router.route('/updateProfile').patch(isAuthenticated,updateProfile);
router.route('/updatePassword').patch(isAuthenticated,updatePassword);

router.route ('/forgetPassword').post(forgetPassword);
router.route('/resetPassword').patch(resetPassword );

 

export default  router;