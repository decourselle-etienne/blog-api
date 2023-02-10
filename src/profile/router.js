const router = require("express").Router();

const { createProfile } = require("./controllers/profile_controller");

// @route   GET /
// TODO:  Get authenticated account.profile
router.get("/", (req, res) => {});

// @route   POST /
router.post("/", createProfile);

// @route   PATCH /
// TODO:  Update authenticated account.profile
router.patch("/", (req, res) => {});

// @route   DELETE /
// TODO: Delete authenticated account.profile
router.delete('/', (req, res) => {});

// @route   GET /:id
// TODO: Get a profile by id
router.get("/:id", (req, res) => {});

// @route   GET /:id/posts
// TODO: Get all posts from a profile
router.get("/:id/posts", (req, res) => {});

// @route   GET /:id/comments
// TODO: Get all comments from a profile
router.get("/:id/comments", (req, res) => {});

module.exports = router;
