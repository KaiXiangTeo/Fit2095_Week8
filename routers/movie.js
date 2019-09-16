var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {

    getAll: function (req, res) {
        Movie.find({}).populate("actors").exec(function (err, movies) {
            if (err) return res.status(400).json(err);

            res.json(movies);
        });
    },


    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
        
    },


    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },


    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },

    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id}, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },

    removeActor: function (req, res) {
        let actorId = req.params.actorId;
        let movieId = req.params.movieId;
        Movie.findOne({_id: movieId }, function(err, movie){
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({_id: actorId }, function(err, actor){
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.remove(actor._id);
                movie.save(function(err){
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                     });
            });
        });
    },

    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },


    getAllYear:function (req, res) {
        let year1 = parseInt(req.params.year1);
        let year2 = parseInt(req.params.year2);
        Movie.where('year').gte(year2).where('year').lte(year1).exec(function (err,data){
            if (err) return res.status(400).json(err);
            res.json(data);

        })
    },

    // getActorAll: function(req,res){
    //     Movie.find({}).populate("actors").exec(function (err, movies) {
    //         if (err) return res.status(400).json(err);

    //         res.json(movies);
    //     });
    // }
};