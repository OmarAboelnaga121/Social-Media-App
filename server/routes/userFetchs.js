const express = require('express');
const userRoutes = express.Router();
const POST = require('../db/models/post')
const USER = require('../db/models/user')
const Friend = require('../db/models/small models/friendsSchema')
const DiscordUser = require('../db/models/discordUser')
const GoogleUser = require('../db/models/googleUser')


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

userRoutes.put('/api/user/addFriend', async(req, res) => {
    try {
        const { userId, friendUserId } = req.body;

        const checkUser = await DiscordUser.findById(userId) || await USER.findById(userId) || await GoogleUser.findById(userId);

        const checkFriend = await DiscordUser.findById(friendUserId) || await USER.findById(friendUserId) || await GoogleUser.findById(friendUserId);

        if (!checkFriend) return res.status(400).json({ message: "Friend Not Found" });
        if (!checkUser) return res.status(400).json({ message: "User Not Found" });
    
        const friend = {
            id: friendUserId, 
            displayName: checkFriend.displayName,
            Image: checkFriend.photo
        };
    
        checkUser.friends.push(friend);
    
        await checkUser.save();
    
        // Respond with the updated user
        res.status(200).json(checkUser);
    } catch (error) {
        res.status(500).json(error);
    }

});

userRoutes.put('/api/user/deleteFriend', async(req, res) => {
    try {
        const { userId, friendUserId } = req.body;

        const checkUser = await DiscordUser.findById(userId) || await USER.findById(userId) || await GoogleUser.findById(userId);

        if (!checkUser) {
            return res.status(400).json({ message: "User Not Found" });
        }

        checkUser.friends = checkUser.friends.filter(friend => friend.id !== friendUserId);

        await checkUser.save();

        res.status(200).json(checkUser);

    } catch (error) {
        res.status(500).json(error);
    }

});

module.exports = userRoutes
