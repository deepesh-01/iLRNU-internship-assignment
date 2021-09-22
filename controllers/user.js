const User = require('../models/user');
const bcrypt = require('bcrypt');

// @route Post api/user/register
// @desc Register User

exports.register = (req,res) => {
    User.findOne({email:req.body.email})
        .then(user => {
            if (user) return res.status(401).json({message: 'Error! User already registered'});

            //create and save user 
            const newUser = new User(req.body);
            newUser.save()
                .then(user => res.status(200).json({token: user.generateJWT()}))
                .catch(err => res.status(500).json({message:err.message}));
        })
        .catch(err => res.status(500).json({success:false, message: err.message}));

};

// @route Post api/user/login
// @desc Login User

exports.login = (req,res) =>{
    User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({msg : 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'})
            }
            // validate password

            if(!user.comparePassword(req.body.password)){ 
                return res.status(401).json({msg:"Invalid email or password"});
                
            }
            // login successful, write token, and send back user 
            res.sendStatus = 200;
            res.json({token: user.generateJWT()});
        })
        .catch(err => {res.status(500).json({code:err.code,message:err.message})
                       console.log(err)});
};

// @route Post api/user/updatePassword
// @desc User password reset

exports.updatePassword = async (req,res) => {
    const user = req.user;
    let pass = req.body.currentPassword;
    let newPass = req.body.newPassword;
    // validate password
    const val = user.comparePassword(pass);
    if(!val) return res.status(401).json({message:"Failure"});
    const _id = user.id;
    // genrate hash of newPassword
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(newPass, salt);
    const val2 = await User.findByIdAndUpdate(_id,{password:newPassword},{new:true});
    return res.status(200).json({message : "Success"});
}

// @route Post api/user/delete
// @desc Delete user

exports.deleteUser = async (req,res) => {
    const user = req.user;
    const _id = user.id;
    const deleted = await User.findByIdAndDelete(_id);
    console.log("deleted user : ", deleted);
    return res.status(200).json({message : "Id deleted Successfully"});
}