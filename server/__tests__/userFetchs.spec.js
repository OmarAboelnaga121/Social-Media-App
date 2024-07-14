const request = require('supertest');
const express = require('express');
const POST = require('../db/models/post')
const USER = require('../db/models/user')
const DiscordUser = require('../db/models/discordUser')
const GoogleUser = require('../db/models/googleUser')
const provideRoutes = require("../routes/userFetchs")
const passport = require('passport');
const bcrypt = require('bcrypt')

const testRoutesApp = express();

testRoutesApp.use(express.json());

// Mock The DB
jest.mock("../db/models/post")
jest.mock("../db/models/user")
jest.mock("../db/models/discordUser")
jest.mock("../db/models/googleUser")

// Middle ware for userRoutes
const routes = testRoutesApp.use(provideRoutes);

describe("Check for the test that it is working", () => {
    it("Should return true", async() => {
        expect(true).toBe(true)
    })
})

describe("All Reqs", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('All Get Reqs', () => {
        it('GET Req ==> Get Data For One User => 200', async () => {
            const mockUser = { id: '1', name: 'John Doe' };
            USER.findById.mockResolvedValue(mockUser);
            DiscordUser.findById.mockResolvedValue(mockUser);
            GoogleUser.findById.mockResolvedValue(mockUser);

            const response = await request(routes).get('/api/user/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
        });
    })

    describe('All Put Reqs', () => {
        it('should add a friend to the user', async () => {
            const userId = 1;
            const friendUserId = 2;
    
            const mockUser = {
                _id: userId,
                friends: [],
                save: jest.fn().mockResolvedValue(true),
            };
    
            const mockFriend = {
                _id: friendUserId,
                displayName: 'Friend Display Name',
                Image: 'Friend Image URL',
            };
    
            // Mock the findById methods
            DiscordUser.findById.mockResolvedValue(mockUser);
            USER.findById.mockResolvedValue(mockUser);
            GoogleUser.findById.mockResolvedValue(mockUser);
    
            DiscordUser.findById.mockResolvedValue(mockUser);
            USER.findById.mockResolvedValue(mockUser);
            GoogleUser.findById.mockResolvedValue(mockFriend);
    
            const response = await request(routes)
                .put('/api/user/addFriend')
                .send({ userId, friendUserId });
    
            expect(response.status).toBe(200);
        });

        it('PUT Req ==> Do Not Add Friend that is not found ==> 400', async () => {
            const userId = 1;
            const friendUserId = 2;
    
            const mockUser = {
                _id: 2,
                friends: [],
                save: jest.fn().mockResolvedValue(true),
            };
    
            const mockFriend = {
                _id: friendUserId,
                displayName: 'Friend Display Name',
                Image: 'Friend Image URL',
            };
    
            DiscordUser.findById.mockResolvedValue(null);
            USER.findById.mockResolvedValue(null);
            GoogleUser.findById.mockResolvedValue(null);
    
            const response = await request(routes)
                .put('/api/user/addFriend')
                .send({ userId, friendUserId });
    
            expect(response.status).toBe(400);
        });
    
        it('PUT Req ==> Delete Friend Successfully ==> 200', async () => {
            const userId = 1;
            const friendUserId = 2;
    
            const mockUser = {
                _id: userId,
                friends: [],
                save: jest.fn().mockResolvedValue(true),
            };
    
            const mockFriend = {
                _id: friendUserId,
                displayName: 'Friend Display Name',
                Image: 'Friend Image URL',
            };
    
            // Mock the findById methods
            DiscordUser.findById.mockResolvedValue(mockUser);
            USER.findById.mockResolvedValue(mockUser);
            GoogleUser.findById.mockResolvedValue(mockUser);
    
            DiscordUser.findById.mockResolvedValue(mockUser);
            USER.findById.mockResolvedValue(mockUser);
            GoogleUser.findById.mockResolvedValue(mockFriend);
    
            const response = await request(routes)
                .put('/api/user/addFriend')
                .send({ userId, friendUserId });
    
            expect(response.status).toBe(200);
        });

        it('PUT Req ==> Delete Friend that is not found ==> 400', async () => {
            const userId = 1;
            const friendUserId = 2;
    
            const mockUser = {
                _id: 2,
                friends: [],
                save: jest.fn().mockResolvedValue(true),
            };
    
            const mockFriend = {
                _id: friendUserId,
                displayName: 'Friend Display Name',
                Image: 'Friend Image URL',
            };
    
            DiscordUser.findById.mockResolvedValue(null);
            USER.findById.mockResolvedValue(null);
            GoogleUser.findById.mockResolvedValue(null);
    
            const response = await request(routes)
                .put('/api/user/addFriend')
                .send({ userId, friendUserId });
    
            expect(response.status).toBe(400);
        });
    
    })
})
