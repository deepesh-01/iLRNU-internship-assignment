
const user = require('./user');
const admin = require('./admin');

module.exports = app => {
    app.use('/api/user', user);
    app.use('/api/admin', admin);
};