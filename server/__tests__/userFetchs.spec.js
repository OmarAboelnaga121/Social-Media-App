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
        it('PUT Req ==> Put Friend Succeffully => 200', async () => {
            const mockFriend = { 
                "id": 1,
                "displayName": "anson@123", 
                "Image": "hello123" ,
            };

            USER.findById.mockResolvedValue(mockFriend);
            DiscordUser.findById.mockResolvedValue(mockFriend);
            GoogleUser.findById.mockResolvedValue(mockFriend);


            const mockUser = { 
                "id": 1,
                "mail": "anson@123", 
                "password": "hello123" ,
                friend:[]
            };

            USER.findById.mockResolvedValue(mockUser);
            DiscordUser.findById.mockResolvedValue(mockUser);
            GoogleUser.findById.mockResolvedValue(mockUser);

            const response = await request(routes).put('/api/user/1').send;

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
        });
    })
})
