require('dotenv').config();

const secret = process.env.JWT_SECRET;

const Jwtstrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

      const User = require('../models/user');
      const Admin = require('../models/admin');

      const opts = {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: secret,
        };

        module.exports = passport => {
            passport.use(
                new Jwtstrategy(opts, (jwt_payload, done) => {
                    User.findById(jwt_payload.id)
                        .then(user => {
                            if(user) return done(null, user);
                            if(!user){
                                Admin.findById(jwt_payload.id)
                                .then(user => {
                                    if(user) return done(null, user);
                                })
                                .catch(err => {
                                    return done(err, false , {message: 'Server Error'});
                                });
                            }
                        })
                        .catch(err => {
                            return done(err, false , {message: 'Server Error'});
                        });
                })
            );
        };