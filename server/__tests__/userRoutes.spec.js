const request = require('supertest');
const express = require('express');
const DiscordUser = require('../db/models/discordUser.js')
const GoogleUser = require('../db/models/googleUser.js')
const USER = require('../db/models/user.js')
const provideRoutes = require("../routes/userRoutes.js")
const passport = require('passport');
const bcrypt = require('bcrypt')

const testRoutesApp = express();

testRoutesApp.use(express.json());

// Mock The DB
jest.mock("../db/models/user")
jest.mock("../db/models/googleUser")
jest.mock("../db/models/discordUser")

// Mock The Passport
jest.mock('passport', () => ({
    authenticate: jest.fn((strategy, options) => {
        return (req, res, next) => {
            req.user = { id: 'test-user' };
            next();
        };
    })
}));

// Middle ware for userRoutes
const routes = testRoutesApp.use(provideRoutes);

// Checking the test is working proply
describe("Check for the test that it is working", () => {
    it("Should return true", async() => {
        expect(true).toBe(true)
    })
})

// The Test of GET, POST, PUT
describe("All Reqeusts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // First GET req
    describe("All tests for get requests", () => {
        it("Get Req ==> Get All Users ==> 200", async() => {
            const mockUsers = [{ 
                "id": 1,
                "mail": "anson@123", 
                "password": "hello123" 
            }, 
            { 
                "id": 2,
                "mail": "anson@123", 
                "password": "hello123" 
            }]
            USER.find.mockResolvedValue(mockUsers);
            
            const response = await request(routes).get('/api/users')
    
            expect(response.status).toBe(200)
            expect(USER.find).toHaveBeenCalledTimes(1);
        })
        it('Get Req ==> login with google', async () => {
            const response = await request(routes).get('/api/users/google');
            expect(response.status).toBe(200);
        });
        it('Get Req ==> login with discord ==> 200', async () => {
            const response = await request(routes).get('/api/users/discord');
            expect(response.status).toBe(200);
        });
    })

    //Second POST Req 
    describe("All tests for Post requests", () => {
        it('Post Req ==> login localy success ==> 201', async () => {
            const userData = {
                displayName: 'John Doe',
                mail: 'johndoe@example.com',
                password: 'password123',
              }
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const mockUser = new USER({
                displayName: userData.displayName,
                mail: userData.mail,
                password: hashedPassword,
                photo: '',
            })

            USER.create.mockResolvedValue(mockUser);

            const response = await request(routes).post('/api/users/register').send(userData);
            expect(response.status).toBe(201);
        });

        it('Post Req ==> login localy fail for display name ==> 404', async () => {
            const response = await request(routes)
            .post('/api/users/register')
            .send({ displayName: 'Te', mail: 'testuser@example.com', password: 'securepassword' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Display name must be more than 2 characters');
        });

        it('Post Req ==> login localy fail for mail ==> 404', async () => {
            const response = await request(routes)
            .post('/api/users/register')
            .send({ displayName: 'omar', mail: 'testuserexample.com', password: 'securepassword' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email must contain @');
        });
    })

    // Third PUT Req
    describe("All tests for put Reqeusts", () => {
        it("PUT req ==> Update Data Fail ==> 400", async() => {
            const userId = '1';
            const userData = {
            displayName: 'John Doe',
            mail: 'johndoe@example.com',
            password: 'password123',
            };

            const updatedUser = {
            _id: userId,
            displayName: userData.displayName,
            mail: userData.mail,
            password: 'hashedPassword123', 
            photo: '',
            };
            USER.findByIdAndUpdate.mockResolvedValue(updatedUser) || DiscordUser.findByIdAndUpdate.mockResolvedValue(updatedUser) || GoogleUser.findByIdAndUpdate.mockResolvedValue(updatedUser);

        
            // Perform request to the endpoint
            const response = await request(routes)
              .put(`/api/users/${userId}`)
              .send(updatedUser);

            expect(response.status).toBe(400)
        })
        it("PUT req ==> Update Data Successfully ==> 200", async() => {
            const userId = '1';
            const userData = {
            displayName: 'John Doe',
            mail: 'johndoe@example.com',
            password: 'password123',
            };

            USER.findById.mockResolvedValue(userData) || GoogleUser.findById.mockResolvedValue(userData) || DiscordUser.findById.mockResolvedValue(userData);

            const updatedUser = {
            _id: userId,
            displayName: userData.displayName,
            mail: userData.mail,
            password: 'hashedPassword123', 
            photo: '',
            };
            USER.findByIdAndUpdate.mockResolvedValue(updatedUser) || GoogleUser.findByIdAndUpdate.mockResolvedValue(userData) || DiscordUser.findByIdAndUpdate.mockResolvedValue(userData);
        
            // Perform request to the endpoint
            const response = await request(routes)
              .put(`/api/users/${userId}`)
              .send(updatedUser);

            expect(response.status).toBe(200)

        })
    })
})