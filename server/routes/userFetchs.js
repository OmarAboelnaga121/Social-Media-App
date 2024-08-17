const express = require('express');
const userRoutes = express.Router();
const POST = require('../db/models/post')
const USER = require('../db/models/user')
const Friend = require('../db/models/small models/friendsSchema')
const DiscordUser = require('../db/models/discordUser')
const GoogleUser = require('../db/models/googleUser')
const passport = require('passport');


userRoutes.get('/api/user/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const user = await USER.findById(id) || await DiscordUser.findById(id) || await GoogleUser.findById(id);
        if(!user) return res.status(400).json({ message: "User Not Found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});
userRoutes.get('/api/userProviders/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const user = await DiscordUser.findOne({discordId: id}) || await GoogleUser.findOne({googleId: id});
        if(!user) return res.status(400).json({ message: "User Not Found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});


userRoutes.put('/api/user/friend', async(req, res) => {
    try {
        const { userId, friendUserId } = req.body;

        // Find the user and the friend
        const checkUser = await GoogleUser.findOne({ googleId: userId }) || await DiscordUser.findById(userId) || await USER.findById(userId) || await GoogleUser.findById(userId);
        const checkFriend = await GoogleUser.findOne({ googleId: friendUserId }) || await DiscordUser.findById(friendUserId) || await USER.findById(friendUserId) || await GoogleUser.findById(friendUserId);

        if (!checkUser) return res.status(400).json({ success: false, message: "User Not Found" });
        if (!checkFriend) return res.status(400).json({ success: false, message: "Friend Not Found" });
        if (friendUserId === userId) return res.status(400).json({ success: false, message: "User cannot add/remove themselves" });

        const isFriendAlready = checkUser.friends.some(friend => friend.id === friendUserId);

        if (isFriendAlready) {
            // Remove the friend
            checkUser.friends = checkUser.friends.filter(friend => friend.id !== friendUserId);
            await checkUser.save();

            res.status(200).json(false);
        } else {
            // Add the friend
            const friend = {
                id: friendUserId,
                displayName: checkFriend.displayName,
                Image: checkFriend.photo
            };
            checkUser.friends.push(friend);
            await checkUser.save();

            res.status(200).json(true);
        }

    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});
userRoutes.put('/api/user/friendCheck', async(req, res) => {
    try {
        const { userId, friendUserId } = req.body;

        // Find the user and the friend
        const checkUser = await GoogleUser.findOne({ googleId: userId }) || await DiscordUser.findById(userId) || await USER.findById(userId) || await GoogleUser.findById(userId);
        const checkFriend = await GoogleUser.findOne({ googleId: friendUserId }) || await DiscordUser.findById(friendUserId) || await USER.findById(friendUserId) || await GoogleUser.findById(friendUserId);

        if (!checkUser) return res.status(400).json({ success: false, message: "User Not Found" });
        if (!checkFriend) return res.status(400).json({ success: false, message: "Friend Not Found" });
        if (friendUserId === userId) return res.status(400).json({ success: false, message: "User cannot add/remove themselves" });

        const isFriendAlready = checkUser.friends.some(friend => friend.id === friendUserId);

        if (isFriendAlready) {
            res.status(200).json(false);
        } else {
            res.status(200).json(true);
        }

    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});

userRoutes.get('/api/user/posts/:userId', async(req, res) => {
    try {
        const { userId } = req.params;

        const checkUser = await GoogleUser.findOne({googleId: userId}) || await DiscordUser.findById(userId) || await USER.findById(userId) || await GoogleUser.findById(userId);

        if (!checkUser) {
            return res.status(400).json({ message: "User Not Found" });
        }
        
        const postsFinder = await POST.find({ CreatorId: userId });
        
        res.status(200).json(postsFinder);
    } catch (error) {
        return res.status(500).json({ message: error})
    }
})

module.exports = userRoutes
