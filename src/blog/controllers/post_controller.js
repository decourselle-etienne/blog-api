const Post = require("../models/post");

const RESPONSE_MESSAGES = require("../../../__constants__/response_messages");

const { getUrl } = require("../../../utils/getter");
const { removeFields } = require("../../../utils/remover");

const createPost = async (req, res) => {

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        owner: req.params.profileID
    });

    try {
        await post.save();

        res.header("Location", getUrl(req, post.id));
        res.status(201).json({ post: removeFields(post.toObject()) });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const postToFind = await Post.findOne({id: req.post.id, owner: req.params.profileID})
        if(!postToFind) {
            res.status(400).json("You can't delete this post")
        }

        await Promise.all([
            Post.deleteOne({ id: req.post.id }), 
            Comment.deleteMany({ post: req.params.id })
        ]);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const getAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const posts = await Post.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .lean()
            .exec();

        const count = await Post.find().count();

        res.status(200).json({
            posts: removeFields(posts),
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findOne({ id: id }).lean().exec();
        if (!post) {
            return res.status(404).json({ msg: RESPONSE_MESSAGES.POST_NOT_FOUND });
        }

        res.status(200).json(removeFields(post));
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const updatePost = async (req, res) => {
    const { id, profileID } = req.params;

    const update = {
        title: req.body.title,
        content: req.body.content,
        updatedAt: Date.now(),
    };

    try {

        const postToFind = await Post.findOne({id: id, owner: profileID});
        if (!postToFind) {
            res.status(400).json("You can't update this post")
        }

        const post = await Post.findOneAndUpdate({ id }, update, {
            new: true,
            runValidators: true,
        })
            .lean()
            .exec();

        res.header("Location", getUrl(req, id));
        res.status(200).json({ post: removeFields(post) });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    createPost,
    deletePost,
    getAll,
    getById,
    updatePost,
};
