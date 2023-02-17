const Comment = require("../../blog/models/comment");
const Company = require("../models/company");
const Person = require("../models/person");
const Post = require("../../blog/models/post");
const Profile = require("../models/profile");


const { getUrl } = require("../../../utils/getter");
const { removeFields } = require("../../../utils/remover");


const getAllProfiles = async (req,res) => {
const profiles = await Profile.find({owner: req.account});
res.status(200).json(profiles)
};

const createProfile = async (req, res) => {
    const { kind, ...body } = req.body;
    let profile;

    try {
        switch (kind) {
            case "person":
                profile = new Person({...body, owner: req.account});
                break;
            case "company":
                profile = new Company({...body, owner: req.account});
                break;
            default:
                return res.status(400).json({ msg: "Invalid kind" });
        }

        await profile.save();

        res.header("Location", getUrl(req, profile.id));
        res.status(201).json(removeFields(profile.toObject()));
    } catch (err) {
        res.status(500).json({ msg: err });
    }
};

const getProfileByID = async (req, res) => {
    const profil = await Profil.findOne({ id: req.params.id });
    if (!profil) {
      return res.status(404).json({ msg: "Profil not found" });
    }
  
    res.status(200).json(profil);
  };

const getProfilesPosts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const profile = await Profile.findOne({ id: req.params.id });
        if (!profile) {
          return res.status(404).json({ msg: "Profile not found" });
        }

        const posts = await Post.find({owner: profile.id})
            .limit(limit)
            .skip((page - 1) * limit)
            .lean()
            .exec();

        const count = await Post.find({owner: profile.id}).count();

        res.status(200).json({
            posts: removeFields(posts),
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const getProfilesComments = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const profile = await Profile.findOne({ id: req.params.id });
        if (!profile) {
          return res.status(404).json({ msg: "Profile not found" });
        }

        const posts = await Comment.find({owner: profile.id})
            .limit(limit)
            .skip((page - 1) * limit)
            .lean()
            .exec();

        const count = await Post.find({owner: profile.id}).count();

        res.status(200).json({
            posts: removeFields(posts),
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const updateProfile = async (req, res) => {
    const id = req.params;
    const {...body} = req.body;

    const update = {
        updatedAt: Date.now(),
    };

    try {

        const profileToFind = await Profile.findOne({...body, id: id, owner: req.account});
        if (!profileToFind) {
            res.status(400).json("You can't update this profile")
        }

        const profile = await Profile.findOneAndUpdate({ id }, update, {
            new: true,
            runValidators: true,
        })
            .lean()
            .exec();

        res.header("Location", getUrl(req, id));
        res.status(200).json({ profile: removeFields(profile) });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const deleteAccount = async (req,res) => {

    const deleteAccount = req.account
    const deleteProfile = await Profile.find({owner:deleteProfile});

    try {
        await Account.deleteOne({id: deleteAccount});

        for (let index = 0; index < deleteProfile.length; index++) {
            const profil = deleteProfile[index];
            
            await Profile.deleteOne({id: profil.id}),
            await Post.deleteMany({ owner: profil.id }), 
            await Comment.deleteMany({ owner: profil.id })
        };

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }


};

const deleteProfile = async (req,res) => {

    const deleteProfile = req.params.id;

    try {
        await Promise.all(
            [
                Profile.deleteOne({id: deleteProfile}),
                Post.deleteMany({ owner: deleteProfile }), 
                Comment.deleteMany({ owner: deleteProfile })
            ]);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }

}

module.exports = {
    getAllProfiles,
    createProfile,
    getProfileByID,
    getProfilesPosts,
    getProfilesComments,
    updateProfile,
    deleteAccount,
    deleteProfile,
};
