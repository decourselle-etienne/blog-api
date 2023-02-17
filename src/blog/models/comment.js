const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    id: {
        type: String,
        default: uuidv4,
    },
    id_post: {
        type: String,
        ref: "Post",
    },
    owner: {
        type: String,
        ref: "Profile", //profile.id
    },
});

module.exports = mongoose.model("Comment", commentSchema);
