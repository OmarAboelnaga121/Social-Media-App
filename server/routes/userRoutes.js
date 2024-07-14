const express = require('express');
const passport = require('passport');
const userRoutes = express.Router();
const USER = require('../db/models/user')
const DiscordUser = require('../db/models/discordUser')
const GoogleUser = require('../db/models/googleUser');
const upload = require('../middlewares/upload');
const bcrypt = require('bcrypt')

userRoutes.get('/api/users', async(req, res) => {
    try {
        const [users, discordUsers, googleUsers] = await Promise.all([
            USER.find(),
            DiscordUser.find(),
            GoogleUser.find()
        ]);
        
        const allUsers = {
            users,
            discordUsers,
            googleUsers
        };
        
        res.status(200).json(allUsers);

    } catch (error) {
        res.status(500).json(error);
    
    }
});



// Register user
userRoutes.post('/api/users/register', upload.single('image'), async(req, res) => {
    try {
        const { displayName, mail, password } = req.body;
        const photo = req.file ? `http://localhost:3001/${req.file.path}` : '';
        
        // Validation
        if (!displayName || displayName.length <= 2) {
            return res.status(400).json({ message: "Display name must be more than 2 characters" });
        }
        if (!mail.includes("@")) {
            return res.status(400).json({ message: "Email must contain @" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)
    
        // Create and save user
        const user = new USER({
            displayName,
            mail,
            password: hashedPassword,
            photo
        });
        await user.save();
    
        // Respond with the created user
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update The user data
userRoutes.put('/api/users/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { displayName, mail, password } = req.body;
        const photo = req.file ? `http://localhost:3000/${req.file.path}` : '';
        

        const checkId = await DiscordUser.findById(id) || await USER.findById(id) || await GoogleUser.findById(id);
        if (!checkId) return res.status(400).json({ message: "Mail not found" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedData = {
            displayName,
            mail,
            password: hashedPassword,
            image: photo
        };

        const user = await USER.findByIdAndUpdate(id, updatedData, { new: true }) || await DiscordUser.findByIdAndUpdate(id, updatedData, { new: true }) ||  await GoogleUser.findByIdAndUpdate(id, updatedData, { new: true });;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login user locally
userRoutes.post('/api/users/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), async(req, res) => {
    res.status(201).json(req.user)
});

// Login user discord
userRoutes.get('/api/users/discord', passport.authenticate('discord'), (req, res) => {
    res.status(200).json(req.user)
});

// Login user google
userRoutes.get('/api/users/google', passport.authenticate('google'), (req, res) => {
        res.status(200).json(req.user)
    });
  

module.exports = userRoutes

// Dummy data
// { 
//     "mail": "anson@123", 
//     "password": "hello123" 
// }