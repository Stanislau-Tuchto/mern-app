const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const request = require('request');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route   GET api/profile/test
// @desc    Test profile route
// @access  Public
router.get('/test', (req, res) => {
	res.json({msg: "profile works"});
});

// @route   get api/profile
// @desc    get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	const errors = {};

	Profile.findOne({user: req.user.id})
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = "There is no profile for this user";
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json(err));
});

// @route   get api/profile/all
// @desc    get all profiles
// @access  Public
router.get('/all', (req, res) => {
	const errors = {};

	Profile.find({})
		.populate('user', ['name', 'avatar'])
		.then(profiles => {
			if (!profiles) {
				errors.noprofile = 'There is no profiles';
				res.status(404).json(errors);
			}
			res.json(profiles);
		})
		.catch(err => {
			errors.err = err;
			res.status(504).json({errors})
		});
});

//TODO: Useless api
// @route   get api/profile/handle/:handle
// @desc    get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
	const errors = {};

	Profile.findOne({handle: req.params.handle})
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user';
				res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => {
			errors.err = err;
			res.status(504).json({errors})
		});
});


// @route   get api/profile/user/:user_id
// @desc    get profile by user
// @access  Public
router.get('/user/:user_id', (req, res) => {
	const errors = {};

	Profile.findOne({user: req.params.user_id})
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user';
				res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => {
			errors.err = err;
			res.status(504).json({errors})
		});
});

// @route   post api/profile
// @desc    create or edit current user profile
// @access  Private
router.post('/',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		const {errors, isValid} = validateProfileInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return res.status(400).json(errors);
		}

		// Get fields
		const profileFields = {};
		profileFields.user = req.user.id;
		if (req.body.handle) profileFields.handle = req.body.handle;
		if (req.body.company) profileFields.company = req.body.company;
		if (req.body.website) {

			profileFields.website = req.body.website
		}
		;
		if (req.body.location) profileFields.location = req.body.location;
		if (req.body.bio) profileFields.bio = req.body.bio;
		if (req.body.status) profileFields.status = req.body.status;
		if (req.body.githubusername)
			profileFields.githubusername = req.body.githubusername;
		// Skills - Spilt into array
		if (typeof req.body.skills !== 'undefined') {
			profileFields.skills = req.body.skills.split(',');
		}

		// Social
		profileFields.social = {};
		if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
		if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
		if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
		if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
		if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

		Profile.findOne({user: req.user.id}).then(profile => {
			if (profile) {
				// Update
				Profile.findOneAndUpdate(
					{user: req.user.id},
					{$set: profileFields},
					{new: true}
				)
					.populate('user', ['name', 'avatar'])
					.then(profile => res.json(profile));
			} else {
				// Create

				// Check if handle exists
				Profile.findOne({handle: profileFields.handle}).then(profile => {
					if (profile) {
						errors.handle = 'That handle already exists';
						res.status(400).json(errors);
					}

					// Save Profile
					new Profile(profileFields).save().then(profile => res.json(profile));
				});
			}
		});
	});

// @route   post api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
	'/experience',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		const {errors, isValid} = validateExperienceInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return res.status(400).json(errors);
		}

		Profile.findOne({user: req.user.id}).then(profile => {
			const newExp = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			// Add to exp array
			profile.experience.unshift(newExp);

			profile.save().then(profile => res.json(profile));
		});
	}
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
	'/education',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		const {errors, isValid} = validateEducationInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return res.status(400).json(errors);
		}

		Profile.findOne({user: req.user.id}).then(profile => {
			const newEdu = {
				school: req.body.school,
				degree: req.body.degree,
				fieldofstudy: req.body.fieldofstudy,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			// Add to exp array
			profile.education.unshift(newEdu);

			profile.save().then(profile => res.json(profile));
		});
	}
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
	'/experience/:exp_id',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Profile.findOne({user: req.user.id})
			.then(profile => {
				// Get remove index
				const removeIndex = profile.experience
					.map(item => item.id)
					.indexOf(req.params.exp_id);

				// Splice out of array
				profile.experience.splice(removeIndex, 1);

				// Save
				profile.save().then(profile => res.json(profile));
			})
			.catch(err => res.status(404).json(err));
	}
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
	'/education/:edu_id',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Profile.findOne({user: req.user.id})
			.then(profile => {
				// Get remove index
				const removeIndex = profile.education
					.map(item => item.id)
					.indexOf(req.params.edu_id);

				// Splice out of array
				profile.education.splice(removeIndex, 1);

				// Save
				profile.save().then(profile => res.json(profile));
			})
			.catch(err => res.status(404).json(err));
	}
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
	'/',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Profile.findOneAndRemove({user: req.user.id}).then(() => {
			User.findOneAndRemove({_id: req.user.id}).then(() =>
				res.json({success: true})
			);
		});
	}
);


// @route   get api/profile/wiki/term
// @desc    get profile by user
// @access  Public
router.get('/wiki/:term', (req, res) => {
	const errors = {};

	request(`https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&utf8=&format=json&srprop=snippet&srsearch=${req.params.term}`, {json: true}, (err, response, body) => {
		if (err) {
			return res.status(504).json({err});
		}
		res.json(response);
	});
});


module.exports = router;