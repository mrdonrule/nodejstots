const express = require("express");
const passport = require('passport');
const UserController = require("../controllers/userController.js");

const router = express.Router();
const Check = require("../middleware/validate.js");
// all route here are starting with /users because we have specified in our index.js
// to start with /users
// router.get('/', Check.auth, UserController.getUsers);
router.get('/login', UserController.loginHtml);

// router.get('/:id', Check.auth, UserController.getUserById);
// router.delete('/:id', Check.auth, UserController.deleteUserById);
// router.patch('/:id', Check.auth, UserController.updateUser);
// router.post('/', Check.auth, UserController.newUser);
router.post('/login', Check.validateLogin, UserController.loginUser);

module.exports = router;