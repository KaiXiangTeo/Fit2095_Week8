const mongoose = require('mongoose');

const Actor = require('../models/actor');
const Movie = require('../models/movie');

module.exports = {

    getAll: function (req, res) {
        Actor.find({}).populate("movies").exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        });
    },

    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();

        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },

    getOne: function (req, res) {
        Actor.findOne({_id: req.params.id})
            .populate('movies') //.populate replaces each ID in the array ‘movies’ with its document.
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },


    updateOne: function (req, res) {
        Actor.findOneAndUpdate({_id: req.params.id}, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            res.json(actor);
        });
    },


    deleteOne: function (req, res) {
        Actor.findOneAndRemove({
            _id: req.params.id
        }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },


    addMovie: function (req, res) {
        Actor.findOne({
            _id: req.params.id
        }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOne({
                _id: req.body.id
            }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);

                    res.json(actor);
                });
            })
        });
    },

    deleteWithMovie: function (req, res) {
        Actor.findOne({_id: req.params.id},function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                actor.movies.forEach(element => {
                Movie.findOneAndRemove({_id: element}, function (err) {
                    if (err) return res.status(400).json(err);
                    })
                });
            });
      
        Actor.findOneAndRemove({_id: req.params.id}, function (err,actor) {
            if (err) return res.status(400).json(err);
            res.json(actor);
        });  
    }, 

    removeMovie: function (req,res){
        let actorId = req.params.actorId;
        let movieId = req.params.movieId;
        Actor.findOne({_id: actorId }, function(err, actor){
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            
            Movie.findOne({_id: movieId }, function(err, movie){
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.remove(movie._id);
                actor.save(function(err){
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                        });
            });
        });
                
    },
    updateAge:function(req, res){
        Actor.updateMany({'bYear':{$lte:51}},{$inc : {'bYear' : 4}}).exec(function (err,actor){
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
                })

    }
};