const express = require("express");
const passport = require('passport');
const adminController = require("../controllers/adminController.js");
const nftController = require("../controllers/nftController.js");

const router = express.Router();
const Check = require("../middleware/validate.js");
const { forwardAuthenticated, ensureAuthenticated } = require('../middleware/isAuth');

// all route here are starting with /users because we have specified in our index.js
// to start with /users

router.get('/dashboard', ensureAuthenticated, adminController.dashBoard);

// User Admin Route
router.get('/user/add', ensureAuthenticated, adminController.signUpHtml);
router.post('/user/add', [ensureAuthenticated, Check.validateRegister], adminController.newUser);
router.get('/user/list', ensureAuthenticated, adminController.getUsers);
router.get('/user/edit/:id', ensureAuthenticated, adminController.getUserById);
router.post('/user/edit/:id', ensureAuthenticated, adminController.updateUser);
router.get('/user/pwd/:id', ensureAuthenticated, adminController.pwdHtml);
router.post('/user/pwd/:id', ensureAuthenticated, adminController.updatePwd);
router.get('/user/delete/:id', ensureAuthenticated, adminController.deleteUser);


// Nft Admin Route
router.get('/nft/add', ensureAuthenticated, nftController.addNft);
router.post('/nft/add', [ensureAuthenticated, Check.validatenewNFT], nftController.newNFT);
router.get('/nft/list', ensureAuthenticated, nftController.getAll);
router.post('/nft/update', ensureAuthenticated, nftController.update);
router.post('/user/edit/:id', ensureAuthenticated, adminController.updateUser);
router.get('/user/pwd/:id', ensureAuthenticated, adminController.pwdHtml);
router.post('/user/pwd/:id', ensureAuthenticated, adminController.updatePwd);
router.get('/user/delete/:id', ensureAuthenticated, adminController.deleteUser);

// Logout admin
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/admin/login');
});
router.get('/login', forwardAuthenticated, adminController.loginHtml);
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;