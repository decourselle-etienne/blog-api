const router = require("express").Router();

const { createProfile, 
    getProfileByID, 
    getAllProfiles, 
    getProfilesPosts, 
    getProfilesComments, 
    deleteAccount,
    deleteProfile,
    updateProfile} = require("./controllers/profile_controller");

// @route   GET /
router.get("/", getAllProfiles);

// @route   POST /
router.post("/", createProfile);

// @route   PATCH /
// TODO:  Update authenticated account.profile
router.patch("/:id",updateProfile);

// @route   DELETE /
router.delete('/', deleteAccount);

// @route   DELETE /
router.delete('/:id', deleteProfile);

// @route   GET /:id
router.get("/:id", getProfileByID);

// @route   GET /:id/posts
router.get("/:id/posts", getProfilesPosts);

// @route   GET /:id/comments
router.get("/:id/comments", getProfilesComments);

module.exports = router;
