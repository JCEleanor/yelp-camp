const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        //it's an index not a validation thou
        unique: true
    }
})

//MongoError: E11000 duplicate key error collection: yelp-camp.users index: email_1 dup key: { email: "xxx@gmail.com" }

UserSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000 && error.keyValue.email) {
        next(new Error('Email address was already taken, please choose a different one.'));
    } else {
        next(error);
    }
});

//passport-local-mongoose will add a username, hash and salt field to store the username, the hashed pwd and the salt value
//this plugin will add some additional function like serializUser or deserializeUser, which determine how the data is stored in the session
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)