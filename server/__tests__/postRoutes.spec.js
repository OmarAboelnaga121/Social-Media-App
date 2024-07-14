const request = require('supertest');
const express = require('express');
const POST = require('../db/models/post')
const USER = require('../db/models/user')
const provideRoutes = require("../routes/postRoutes")
const passport = require('passport');
const bcrypt = require('bcrypt')

const testRoutesApp = express();

testRoutesApp.use(express.json());

// Mock The DB
jest.mock("../db/models/post")
jest.mock("../db/models/user")

// Middle ware for userRoutes
const routes = testRoutesApp.use(provideRoutes);

describe("Check for the test that it is working", () => {
    it("Should return true", async() => {
        expect(true).toBe(true)
    })
})

describe("All Reqs", () => {
    afterAll(() => {
        jest.clearAllMocks();
    })
    describe("All tests for get requests", () => {
        it("GET Req ==> Get All Posts Successfully=>> 200", async() => {
            const mockPosts = [{ 
                "id": 1,
                "CreatorId": "2", 
                "Description": "WOW" 
            }, 
            { 
                "id": 2,
                "CreatorId": "5", 
                "Description": "OMG" 
            }]
            POST.find.mockResolvedValue(mockPosts);
            
            const response = await request(routes).get('/api/posts')
    
            expect(response.status).toBe(200)
            expect(response.body).toEqual(mockPosts)
        })
        it("GET Req ==> Get All Posts Fail => 500", async() => {
            const mockPosts = [{ 
                "id": 1,
                "CreatorId": "2", 
                "Description": "WOW" 
            }, 
            { 
                "id": 2,
                "CreatorId": "5", 
                "Description": "OMG" 
            }]
            POST.find.mockRejectedValue(mockPosts);
            
            const response = await request(routes).get('/api/posts')
    
            expect(response.status).toBe(500)
        })
    })
    describe("All tests for Post requests", () => {
        it("POST Req ==> Create Post Successfully ==> 201", async() => {
            const mockUser = { 
                "id": 1,
                "mail": "anson@123", 
                "password": "hello123" 
            }
            USER.findById.mockResolvedValue(mockUser)
            const mockPost = { 
                // "id": 1,
                "CreatorId": 2, 
                "Description": "WOWWOWOWO",
                "photo": ''
            }
            POST.create.mockResolvedValue(mockPost);
            
            const response = await request(routes).post('/api/posts').send(mockPost)
    
            expect(response.status).toBe(201)
        })
        it("POST Req ==> Create Post Fail due to not found user => 500", async() => {

            const mockPosts = [{ 
                "id": 1,
                "CreatorId": "2", 
                "Description": "WOW" 
            }]
            const mockUser = { 
                "id": 1,
                "mail": "anson@123", 
                "password": "hello123" 
            }
            USER.findById.mockRejectedValue(mockUser)

            const mockPost = { 
                // "id": 1,
                "CreatorId": 2, 
                "Description": "WOWWOWOWO",
                "photo": ''
            }
            POST.create.mockResolvedValue(mockPost);
            
            const response = await request(routes).post('/api/posts').send(mockPost)
    
            expect(response.status).toBe(500)
        })
    })

    describe("All tests for Delete requests", () => {
        it("DELETE Req ==> Delete Post Successfully ==> 200", async() => {
            const mockPost = { 
                "id": 1,
                "CreatorId": 2, 
                "Description": "WOWWOWOWO",
                "photo": ''
            }
            POST.findByIdAndDelete.mockResolvedValue(mockPost);
            
            const response = await request(routes).delete('/api/posts/1')
    
            expect(response.status).toBe(200)
            expect(response.body).toEqual({message: "Post is Deleted"})
        })
    })

    describe("All tests for Put requests", () => {
        it("PUT Req ==> Put Like for post Successfully ==> 200", async() => {
            const mockPost = { 
                _id: "1",
                CreatorId: "2", 
                Description: "WOWWOWOWO",
                photo: '',
                Likes: 0,
                save: jest.fn().mockResolvedValue(true)
            };
    
            POST.findById.mockResolvedValue(mockPost);
    
            const response = await request(routes).put('/api/posts/addLike/1').send();
    
            expect(response.status).toBe(200);

        })

        it("PUT Req ==> Do Not Put Like from a user Not found ==> 404", async() => {
            POST.findById.mockResolvedValue(null);

            const response = await request(routes).put('/api/posts/addLike/10').send();
        
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('msg', 'Post not found');
        })

        it("PUT Req ==> Remove Like from a post Successfully ==> 200", async() => {
            const mockPost = { 
                _id: "1",
                CreatorId: "2", 
                Description: "WOWWOWOWO",
                photo: '',
                Likes: 0,
                save: jest.fn().mockResolvedValue(true)
            };
    
            POST.findById.mockResolvedValue(mockPost);
    
            const response = await request(routes).put('/api/posts/removeLike/1').send();
    
            expect(response.status).toBe(200);
        })

        it("PUT Req ==> Do Not remove like from a user Not found ==> 404", async() => {
            POST.findById.mockResolvedValue(null);

            const response = await request(routes).put('/api/posts/removeLike/10').send();
        
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('msg', 'Post not found');
        })

        it("PUT Req ==> Put Report for a post Successfully ==> 200", async() => {
            const mockPost = { 
                _id: "1",
                CreatorId: "2", 
                Description: "WOWWOWOWO",
                photo: '',
                Likes: 0,
                Report: [], ReportsNumber: 0, save: jest.fn()
            };
            POST.findById.mockResolvedValue(mockPost);

            USER.findById.mockResolvedValue({ _id: '123' });

        const response = await request(routes).put('/api/posts/addReport/1').send({ reporterId: '123', reportReason: 'spam' });

        expect(response.status).toBe(201);

        })

        it("PUT Req ==> Do Not Put report For a post Not found ==> 404", async() => {
            POST.findById.mockResolvedValue(null);

            const response = await request(routes).put('/api/posts/addReport/10').send();
        
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('msg', 'Post not found');
        })

        it("PUT Req ==> Do Not Put report From a user Not found ==> 404", async() => {
            POST.findById.mockResolvedValue(null);

            const response = await request(routes).put('/api/posts/addReport/10').send();
        
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('msg', 'Post not found');
        })

        it('should return 404 if the user has already reported the post', async () => {
            POST.findById.mockResolvedValue({ Report: [{ reporterId: '123' }] });
            USER.findById.mockResolvedValue({ _id: '123' });
            const response = await request(routes).put('/api/posts/addReport/1').send({ reporterId: '123', reportReason: 'spam' });
            expect(response.status).toBe(404);
            expect(response.body.msg).toBe('You have already reached the maximum number of reports.');
        });
    
        it('should delete the post if the ReportsNumber reaches 6', async () => {
            const post = { Report: [], ReportsNumber: 5, save: jest.fn(), id: '1' };
            POST.findById.mockResolvedValue(post);
            USER.findById.mockResolvedValue({ _id: '123' });
    
            const response = await request(routes).put('/api/posts/addReport/1').send({ reporterId: '123', reportReason: 'spam' });
    
            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Report Has Been Deleted Due to Reports');
        });
    })
})