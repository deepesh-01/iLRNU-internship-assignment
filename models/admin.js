const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:"Your Email is required",
        trim:true,
    },
    password:{
        type:String,
        required:"Your password is required",

    },
    name:{
        type:String,
        required:"Your name is required",
    },
    admin:{
        type:Boolean,
        default:true,
    }
});

AdminSchema.pre('save', function(next) {
    const admin = this;

    if(!admin.isModified('password')) return next();

    bcrypt.genSalt(10, (err,salt)=> {
        if(err){
            console.log(error)
            return next(err)};

        bcrypt.hash(admin.password, salt, (err, hash)=>{
            if(err){
                console.log(error)
                return next(err)
            };
            console.log("password updated");
            admin.password = hash;  
            next();
        })
    })
});

AdminSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
};

AdminSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 7);

    let payload = {
        id: this._id,
        email: this.email,
        name: this.name,
        phoneNumber: this.phoneNumber,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime()/1000, 10)
    });
};

module.exports  = mongoose.model('Admin', AdminSchema);