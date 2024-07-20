const passport = require('passport');
const discordPassport = require('passport-discord').Strategy;
const DiscordUser = require('../db/models/discordUser')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await DiscordUser.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new discordPassport({
    clientID: process.env.DiscordClientId,
    clientSecret: process.env.DiscordClientPassword,
    callbackURL: process.env.CallBackURL,
    scope:["identify", "email"]
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const user = await DiscordUser.findOne({discordId: profile.id})
        console.log(profile);

        if(!user){
            await DiscordUser.create({
                discordId: profile.id,
                displayName: profile.username,
                mail: profile.email,
                photo: profile.avatar
            })
        }

        done(null, user)
    } catch (error) {
        done(error, null)
    }
}))