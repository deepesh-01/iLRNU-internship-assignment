const express = require('express');
const {check} = require('express-validator');
const Admin = require('../controllers/admin');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validator');

const router = express.Router();

router.get('/',(req,res)=>{
    return res.status(200).json({message:"You are in Admin endpoint. Register or Login to test Auth"});
});

router.post('/register',[
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long'),
    check('name').not().isEmpty().withMessage('You first name is required'),
],validate, Admin.register);

router.post("/login", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().withMessage("Enter the password"),
], validate, Admin.login);

router.post("/updatePassword", authenticate.Verify, Admin.updatePassword);

router.post("/delete", authenticate.Verify, Admin.deleteAdmin);

module.exports = router;

