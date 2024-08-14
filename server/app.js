// Consts and imports
const express = require('express');
const DB = require('./db/db');
const app = express();
const PORT = 8001;
const passport = require('passport');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const userFetchs = require('./routes/userFetchs');
const contactRoutes = require('./routes/contactRoutes');
const postRoutes = require('./routes/postRoutes');
const localPassport = require('./stratgies/local-stratgy');
const discordPassport = require('./stratgies/discord-stratgy');
const googlePassport = require('./stratgies/google-stratgy');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json'); 
const cors = require('cors');

// Required to get the data from ==> .env
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Session Config
app.use(session({
    secret: 'ljyhgsduoriyfuyoawisguyorhas', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

//Passport Config
app.use(passport.initialize());
app.use(passport.session());

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile)); 

//The Routes
app.use(postRoutes);
app.use(userRoutes);
app.use(userFetchs);
app.use(contactRoutes);

// The port which the application will listen on
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.theHost}`);
});
