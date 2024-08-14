const express = require('express');
const postRoutes = express.Router();
const POST = require('../db/models/post')
const USER = require('../db/models/user')
const DiscordUser = require('../db/models/discordUser')
const GoogleUser = require('../db/models/googleUser')
const upload = require('../middlewares/upload');
const mongoose = require('mongoose');

//Get All posts
postRoutes.get('/api/posts', async (req, res) => {
    const { excludeIds } = req.query;

    try {
        const excludedObjectIds = excludeIds ? excludeIds.split(',').map(id => mongoose.Types.ObjectId(id)) : [];

        const posts = await POST.aggregate([
            { $match: { _id: { $nin: excludedObjectIds } } },  
            { $sample: { size: 10 } }
        ]);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error });
    }
});


// Post post
postRoutes.post("/api/posts", upload.single('image'), async(req, res) => {
    try {
        const { CreatorId, Description } = req.body
        const photo = req.file ? `${process.env.theHost}/${req.file.path}` : '';

        const checkUser = await GoogleUser.findOne({googleId: CreatorId}) || await USER.findById(CreatorId) || await GoogleUser.findById(CreatorId) || await DiscordUser.findById(CreatorId);

        if(!CreatorId || !checkUser) return res.status(404).json({msg: "User does not exist."})
        
        if(!Description || Description.length < 5) return res.status(404).json({msg: "Description must be at least 5 characters."})

        const post = new POST({
            CreatorId,
            Description,
            photo
        });

        checkUser.postNumber += 1;

        await post.save();
        await checkUser.save();
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
        const { userId } = req.body;
        const post = await POST.findById(id);
        const checkUser = await GoogleUser.findOne({googleId: userId}) || await USER.findById(userId) || await GoogleUser.findById(userId) || await DiscordUser.findById(userId);
        
        if (!post) return res.status(404).json({ msg: "Post not found" });
        if (!checkUser) return res.status(404).json({ msg: "User not found" });

        const hasLiked = post.LikedBy.includes(userId);
        if (hasLiked) {
            post.LikedBy = post.LikedBy.filter(user => user !== userId);
            post.Likes -= 1;
        } else {
            post.LikedBy.push(userId);
            post.Likes += 1;
        }

        await post.save();

        res.status(200).json({post});
    } catch (error) {
        res.status(500).json({error});
    }
})

// Add report to a post
postRoutes.put("/api/posts/addReport/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { reporterId, reportReason } = req.body;
  
      if (!reporterId || !reportReason) {
        return res.status(400).json({ msg: "Description Is Not Valid" });
      }
  
      const post = await POST.findById(id);
      if (!post) return res.status(404).json({ msg: "Post not found" });

      

    //   const reporterObjectId = mongoose.Types.ObjectId(reporterId);

  
      const checkUser = await USER.findById(reporterId) || await DiscordUser.findById(reporterId) || await GoogleUser.findById(reporterId) || await GoogleUser.findOne({ googleId: reporterId });
  
      if(reporterId === post.CreatorId) return res.status(400).json({ msg: "This is your Post" });
      
      if (!checkUser) return res.status(404).json({ msg: "User not found" });
  
      const hasReported = post.Report.some(report => report.reporterId === reporterId);
      if (hasReported) {
        return res.status(400).json({ msg: "You have already reached the maximum number of reports." });
      }
  
      post.Report.push({ reporterId, reportReason });
      post.ReportsNumber += 1;
  
      if (post.ReportsNumber >= 6) {
        await POST.findByIdAndDelete(id);
        return res.status(200).json({ msg: "Post has been deleted due to multiple reports" });
      } else {
        await post.save();
        return res.status(201).json({ msg: "Report has been created" });
      }
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ error: error.message });
    }
  });
// Add Comment to a post
postRoutes.put("/api/posts/addComment/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { commenterId, commentText } = req.body;
        const post = await POST.findById(id)
        if(!post) return res.status(404).json({msg: "Post not found"})

        const checkUser = await GoogleUser.findOne({ googleId: commenterId }) || await USER.findById(commenterId) || await DiscordUser.findById(commenterId) || await GoogleUser.findById(commenterId)
        if(!checkUser) return res.status(404).json({msg: "User not found"})

        post.Comments.push(req.body);
        post.CommentsNumber += 1;

        await post.save()
        res.status(201).json(req.body)
        
    } catch (error) {
        res.status(500).json({error});
    }
})
module.exports = postRoutes
