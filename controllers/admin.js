const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

// @route Post api/admin/register
// @desc Register Admin

exports.register = (req,res) => {
    Admin.findOne({email:req.body.email})
        .then(admin => {
            if (admin) return res.status(401).json({message: 'Error! User already registered'});

            //create and save user 
            const newAdmin = new Admin(req.body);
            newAdmin.save()
                .then(admin => res.status(200).json({token: admin.generateJWT()}))
                .catch(err => res.status(500).json({message:err.message}));
        })
        .catch(err => res.status(500).json({success:false, message: err.message}));

};

// @route Post api/admin/login
// @desc Admin Login

exports.login = (req,res) =>{
    Admin.findOne({email : req.body.email})
        .then(admin => {
            if(!admin){ 
                return res.status(401).json({msg : 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'})
            }
            // validate password

            if(!admin.comparePassword(req.body.password)){ 
                return res.status(401).json({msg:"Invalid email or password"});
                
            }
            // login successful, write token, and send back admin 
            res.sendStatus = 200;
            res.json({token: admin.generateJWT()});
        })
        .catch(err => {res.status(500).json({code:err.code,message:err.message})
                       console.log(err)});
};

// @route Post api/admin/updatePassword
// @desc Admin password reset 

exports.updatePassword = async (req,res) => {
    const admin = req.user;
    let pass = req.body.currentPassword;
    let newPass = req.body.newPassword;
    // validate password
    const val = admin.comparePassword(pass);
    if(!val) return res.status(401).json({message:"Failure"});
    const _id = admin.id;
    const salt = await bcrypt.genSalt(10);
    // generate hash of new password
    const newPassword = await bcrypt.hash(newPass, salt);
    const val2 = await Admin.findByIdAndUpdate(_id,{password:newPassword},{new:true});
    return res.status(200).json({message : "Success"});
}

// @route Post api/admin/delete
// @desc Admin Id delete

exports.deleteAdmin = async (req,res) => {
    const admin = req.user;
    const _id = admin.id;
    const deleted = await Admin.findByIdAndDelete(_id,{new:true});
    console.log("deleted admin : ", deleted);
    return res.status(200).json({message : "ID deleted Successfully"});
}