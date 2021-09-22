const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
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
    phoneNumber:{
        type:String,
        required:"Phone number is required",
    },
    admin:{
        type:Boolean,
        default:false,
    }
});

UserSchema.pre('save', function(next) {
    const user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err,salt)=> {
        if(err){
            console.log(error)
            return next(err)};

        bcrypt.hash(user.password, salt, (err, hash)=>{
            if(err){
                console.log(error)
                return next(err)
            };
            console.log("password updated");
            user.password = hash;  
            next();
        })
    })
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 7);

    let payload = {
        id: this._id,
        email: this.email,
        name: this.name,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime()/1000, 10)
    });
};

// mongoose.set('useFindAndModify', false);
module.exports  = mongoose.model('Users', UserSchema);