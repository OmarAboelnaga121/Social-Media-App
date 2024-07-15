const passport = require('passport');
const localPassport = require('passport-local').Strategy;
const USER = require('../db/models/user')
const bcrypt = require('bcrypt')


passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id)
})

passport.deserializeUser(async(id, done) => {
    console.log(id);
    const checkId = await USER.findById(id)
    done(null, checkId)
})

passport.use(new localPassport ({ usernameField: 'mail'}, async(mail, password, done) => {
    try {
        console.log(mail);
        const findUser = await USER.findOne({ mail })

        if(!findUser) throw new Error("Mail is not found")
        
        const isPasswordValid = await bcrypt.compare(password, findUser.password);

        if(!isPasswordValid) throw new Error("Password is invalid")


        done(null, findUser)
        
    } catch (error) {
        done(error, null)
    }
}))

module.exports = passport;