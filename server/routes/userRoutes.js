const express = require('express');
const passport = require('passport');
const userRoutes = express.Router();
const USER = require('../db/models/user')
const DiscordUser = require('../db/models/discordUser')
const GoogleUser = require('../db/models/googleUser');
const upload = require('../middlewares/upload');
const bcrypt = require('bcrypt')
const { checkAuth } = require('../utils/utils')

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
        const photo = req.file ? `${process.env.theHost}${req.file.path}` : `${process.env.theHost}/uploads/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg`;
        
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

        const checkMail = await USER.findOne({mail})
        if(checkMail){
            return res.status(400).json({ message: "The Mail is Already sign in" });
        }else{
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
        }

    } catch (error) {
        res.status(500).json(error);
    }
});

userRoutes.get('/api/auth-status', (req, res) => {
    try {
        console.log('Checking authentication status...');
        if (!req.isAuthenticated()) {
            console.log('User is not authenticated.');
            res.send(false);
        }else{
            console.log('User is authenticated.');
            res.send(true);
        }

    } catch (error) {
        res.status(500).send(error);
    }
});

// Update The user data
userRoutes.put('/api/users/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { displayName, mail, password } = req.body;
        const photo = req.file ? `${process.env.theHost}/${req.file.path}` : '';
        

        const checkId = await DiscordUser.findById(id) || await USER.findById(id) || await GoogleUser.findById(id);
        if (!checkId) return res.status(400).json({ message: "Mail not found" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedData = {
            displayName,
            mail,
            password: hashedPassword,
            image: photo
        };

        const user = await USER.findByIdAndUpdate(id, updatedData, { new: true }) || await DiscordUser.findByIdAndUpdate(id, updatedData, { new: true }) ||  await GoogleUser.findByIdAndUpdate(id, updatedData, { new: true });

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
    failureRedirect: '/api/users/register'
}), async(req, res) => {
    res.status(200).json(req.user);
});

// Login user discord
userRoutes.get('/api/users/discord', passport.authenticate('discord'), (req, res) => {
    res.status(200).json(req.user)
});

userRoutes.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: 'http://localhost:4200' }),
    (req, res) => {
        res.cookie('_id', req.user.id, { httpOnly: false, secure: true, sameSite: 'None' });
        res.redirect('http://localhost:4200/dashboard');
    }
  );

// Login user google
userRoutes.get('/api/users/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

userRoutes.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:4200/register' }),
  async(req, res) => {
    console.log(req.user.id);
    
    res.cookie('_id', req.user.id, res.cookie('_id', req.user.id, { 
        httpOnly: false, 
        secure: false,  
        sameSite: 'None',  
        path: '/'
    }));
    res.redirect('http://localhost:4200/dashboard');
  
  }
);

module.exports = userRoutes