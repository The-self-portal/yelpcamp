const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchasync');
const passport = require('passport');
const UserControl = require('../controllers/user');


router.route('/register')
    .get(UserControl.displayRegister)
    .post(catchAsync(UserControl.registerUser));

    router.route('/login')
    .get(UserControl.displayLogin)
    .post(passport.authenticate('local' , {failureFlash:true,failureRedirect : '/login'}), UserControl.acceptLogin)

router.get('/logout', UserControl.logout)



module.exports = router ;