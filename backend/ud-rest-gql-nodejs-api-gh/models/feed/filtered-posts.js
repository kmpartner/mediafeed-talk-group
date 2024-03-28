const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filteredPostsSchema = Schema({
    name: { type: String },
    posts: { type: Array },
    createTime: { type: Number },

    // mostLikePosts: {
    //   posts: { type: Array },
    //   createTime: { type: Number },
    // },
    
}, 
{ timestamps: true }
);

module.exports = mongoose.model('FilteredPosts', filteredPostsSchema);