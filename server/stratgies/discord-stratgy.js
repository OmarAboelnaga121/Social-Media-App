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
                photo: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`
                // https://cdn.discordapp.com/avatars/1191082353162985492/a1ba85074261a93ff9087438ab2f497c.png
            })
        }

        done(null, user)
    } catch (error) {
        done(error, null)
    }
}))