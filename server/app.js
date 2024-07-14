// Consts and imports
const express = require('express');
const DB = require('./db/db');
const app = express();
const PORT = 3000;
const passport = require('passport');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const userFetchs = require('./routes/userFetchs');
const postRoutes = require('./routes/postRoutes');
const localPassport = require('./stratgies/local-stratgy');
const discordPassport = require('./stratgies/discord-stratgy');
const googlePassport = require('./stratgies/google-stratgy');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json'); 

// Required to get the data from ==> .env
require('dotenv').config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(session({
    secret: 'ljyhgsduoriyfuyoawisguyorhas', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 60 } 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile)); 

app.use(postRoutes);
app.use(userRoutes);
app.use(userFetchs);

// The port which the application will listen on
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
