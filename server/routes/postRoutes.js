const express = require('express');
const postRoutes = express.Router();
const POST = require('../db/models/post')
const USER = require('../db/models/user')
const DiscordUser = require('../db/models/discordUser')
const GoogleUser = require('../db/models/googleUser')
const upload = require('../middlewares/upload');

//Get All posts
postRoutes.get('/api/posts', async(req, res) => {
    try {
        const users = await POST.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({error});
    }
});

// Post post
postRoutes.post("/api/posts", upload.single('image'), async(req, res) => {
    try {
        const { CreatorId, Description } = req.body
        const photo = req.file ? req.file.path : '';

        const checkUser = await USER.findById(CreatorId);

        if(!CreatorId || !checkUser) return res.status(404).json({msg: "User does not exist."})
        
        if(!Description || Description.length < 5) return res.status(404).json({msg: "Description must be at least 5 characters."})

        const post = new POST({
            CreatorId,
            Description,
            photo
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({error});
    }
})

// Delete Post
postRoutes.delete("/api/posts/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await POST.findByIdAndDelete(id)
        res.status(200).json({message: "Post is Deleted"});
    } catch (error) {
        res.status(500).json({error});
    }
})

// Add Like to post
postRoutes.put("/api/posts/addLike/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const post = await POST.findById(id)
        if(!post) return res.status(404).json({msg: "Post not found"})
        
        post.Likes += 1;
    
        await post.save()
        res.status(200).json({post});
    } catch (error) {
        res.status(500).json({error});
    }
})

//Remove the like from the post
postRoutes.put("/api/posts/removeLike/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const post = await POST.findById(id)
        if(!post) return res.status(404).json({msg: "Post not found"})
        
        post.Likes -= 1;

        await post.save()
        res.status(200).json({post});
    } catch (error) {
        res.status(500).json({error});
    }
})

// Add report to a post
postRoutes.put("/api/posts/addReport/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { reporterId, reportReason } = req.body;
        const post = await POST.findById(id)
        if(!post) return res.status(404).json({msg: "Post not found"})

        const checkUser = await USER.findById(reporterId) || await DiscordUser.findById(reporterId) || await GoogleUser.findById(reporterId) 
        if(!checkUser) return res.status(404).json({msg: "User not found"})

        const hasReported = post.Report.some(report => report.reporterId === reporterId);
        if (hasReported) {
            return res.status(404).json({ msg: "You have already reached the maximum number of reports." });
        }
        post.Report.push(req.body);
        post.ReportsNumber += 1;

        if(post.ReportsNumber == 6){
            await POST.findByIdAndDelete(id)
            res.status(200).json({msg: "Report Has Been Deleted Due to Reports"})
        }else{
            await post.save()
            res.status(201).json({msg: "Report Has Been Created"})
        }
    } catch (error) {
        res.status(500).json({error});
    }
})

// Add Comment to a post
postRoutes.put("/api/posts/addComment/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { commenterId, commentText } = req.body;
        const post = await POST.findById(id)
        if(!post) return res.status(404).json({msg: "Post not found"})

        const checkUser = await USER.findById(commenterId) || await DiscordUser.findById(commenterId) || await GoogleUser.findById(commenterId) 
        if(!checkUser) return res.status(404).json({msg: "User not found"})

        post.Comments.push(req.body);
        post.CommentsNumber += 1;

        await post.save()
        res.status(201).json({msg: "Comment Has Been Created"})
        
    } catch (error) {
        res.status(500).json({error});
    }
})
module.exports = postRoutes
