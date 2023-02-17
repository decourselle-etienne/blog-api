const express = require("express");
const router = express.Router();

const { createPost, deletePost, getAll, getById, updatePost } = require("./controllers/post_controller");

const { createComment, deleteComment, getAllComments } = require("./controllers/comment_controller");

const { postExistsMiddleware, contentBodyMiddleware } = require("./middlewares");

router.use((req, res, next) => {
    delete req.body.id;
    delete req.body.__v;

    next();
});

// @route   GET /blog/posts
router.get("/posts", getAll);

// @route   GET /blog/posts/:id
router.get("/posts/:id", postExistsMiddleware, getById);

// @route   POST /blog/posts/:id
// create a post with a specific profile
router.post("/posts/:profileID", contentBodyMiddleware, createPost);

// @route   PUT /blog/posts/:profileID/:id
router.patch("/posts/:profileID/:id", postExistsMiddleware, contentBodyMiddleware, updatePost);

// @route   DELETE api/blog/posts/:id
router.delete("/posts/:profileID/:id", postExistsMiddleware, deletePost);

// @route   GET /blog/posts/:id/comments
router.get("/posts/:id/comments", postExistsMiddleware, getAllComments);

// @route   POST /blog/posts/:id/comments
router.post("/posts/:id/comments/:profileID", postExistsMiddleware, createComment);

// @route   DELETE /blog/comments/:commentId
router.delete("/comments/:profileID/:id", deleteComment);

module.exports = router;
