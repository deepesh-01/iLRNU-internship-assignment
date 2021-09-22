const express = require('express');
const {check} = require('express-validator');
const User = require('../controllers/user');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validator');

const router = express.Router();

router.get('/',(req,res)=>{
    return res.status(200).json({message:"You are in User endpoint. Register or Login to test User"});
});

router.post('/register',[
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long'),
    check('name').not().isEmpty().withMessage('You first name is required'),
    check('phoneNumber').not().isEmpty().withMessage('You last name is required'),
],validate, User.register);

router.post("/login", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().withMessage("Enter the password"),
], validate, User.login);

router.post("/updatePassword", authenticate.Verify, User.updatePassword);

router.post("/delete", authenticate.Verify, User.deleteUser);

module.exports = router;