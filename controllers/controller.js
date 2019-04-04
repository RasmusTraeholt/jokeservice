"use strict";

const Post = require('../models/Post');

// Returns a promise that resolves when the post is created
exports.createPost = function (setup, punchline) {
    const post = new Post({
        setup,
        punchline
    });
    return post.save();
};

// Returns a promise that resolves when a post is found with the specified id
exports.getPost = function (id) {
    return Post.findOne({_id: id}).exec();
};

// Returns a promise that resolves with an array of all posts
exports.getPosts = function () {
    return Post.find().exec();
};