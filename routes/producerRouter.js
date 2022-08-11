const express = require('express');
const Producer = require('../models/producer');
const authenticate = require('../authenticate'); //
//const cors = require('./cors'); //

const producerRouter = express.Router();

producerRouter.route('/')
// .options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get((req, res, next) => {
    Producer.find()
    .populate('comments.author')
    .then(producers => {
        res.statusCode = 200;
        res.setHeader = ('Content-Type', 'application/json');
        res.json(producers);
    })
    .catch(err => next(err));
})
.post( authenticate.verifyUser, (req, res, next) => {
    Producer.create(req.body)
    .then(producer => {
        console.log('Producer Created', producer);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(producer);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /producers ');
})
// authenticate for only admin? 
.delete(authenticate.verifyUser, (req, res, next) => {
    Producer.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

producerRouter.route('/:producerId')
.get((req, res, next) => {
    Producer.findById(req.params.producerId)
    .then(producer => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(producer);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /producers/${req.params.producerId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Producer.findByIdAndUpdate(req.params.producerId, {
        $set: req.body
    }, { new: true })
    .then(producer => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(producer);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Producer.findByIdAndDelete(req.params.producerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

producerRouter.route('/:producerId/comments')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Producer.findById(req.params.producerId)
    .populate('comments.author')
    .then(producer => {
        if (producer) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(producer.comments);
        } else {
            err = new Error(`Producer ${req.params.producerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Producer.findById(req.params.producerId)
    .then(producer => {
        if (producer) {
            req.body.author = req.user._id;
            producer.comments.push(req.body);
            producer.save()
            .then(producer => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(producer);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Producer ${req.params.producerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /producers/${req.params.producerId}/comments`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Producer.findById(req.params.producerId)
    .then(producer => {
        if (producer) {
            for (let i = (producer.comments.length-1); i >= 0; i--) {
                producer.comments.id(producer.comments[i]._id).remove();
            }
            producer.save()
            .then(producer => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(producer);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Producer ${req.params.producerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

producerRouter.route('/:producerId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Producer.findById(req.params.producerId)
    .populate('comments.author')
    .then(producer => {
        if (producer && producer.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(producer.comments.id(req.params.commentId));
        } else if (!producer) {
            err = new Error(`Producer ${req.params.producerId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /producers/${req.params.producerId}/comments/${req.params.commentId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Producer.findById(req.params.producerId)
    .then(producer => {
        if (producer && producer.comments.id(req.params.commentId)) {
            if ((producer.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
                if (req.body.rating) {
                    producer.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.text) {
                    producer.comments.id(req.params.commentId).text = req.body.text;
                }
                producer.save()
                .then(producer => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(producer);
                })
                .catch(err => next(err));
            } else {
                err = new Error('You are not authorized to update this comment'); 
                err.statusCode = 403; 
                return next(err); 
            }
        } else if (!producer) {
            err = new Error(`Producer ${req.params.producerId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Producer.findById(req.params.producerId)
    .then(producer => {
        if (producer && producer.comments.id(req.params.commentId)) {
            if ((producer.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
                producer.comments.id(req.params.commentId).remove();
                producer.save()
                .then(producer => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(producer);
                })
                .catch(err => next(err));
            } else {
                err = new Error('You are not authorized to update this comment'); 
                err.statusCode = 403; 
                return next(err); 
            }
        } else if (!producer) {
            err = new Error(`Producer ${req.params.producerId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = producerRouter;