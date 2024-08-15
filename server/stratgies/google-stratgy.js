const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleUser = require('../db/models/googleUser');

passport.serializeUser((user, done) => {
    // console.log(user);
    // console.log(user._id.toString()); 
    // console.log(user.id); 
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await GoogleUser.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GoogleClientId,
    clientSecret: process.env.GoogleClientPassword,
    callbackURL: process.env.CallBackURLGoogle,
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log(profile);
        let user = await GoogleUser.findOne({ googleId: profile.id });

        if (!user) {
            user = await GoogleUser.create({
                googleId: profile.id,
                displayName: profile.displayName,
                mail: profile.emails[0].value,
                photo: profile._json.picture
            });
        }

        done(null, user); 
    } catch (error) {
        done(error, null);
    }
}));

module.exports = passport;
