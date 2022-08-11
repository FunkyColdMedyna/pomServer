const express = require('express');
const Producer = require('../models/producer');
// const authenticate = require('../authenticate'); //
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
.post((req, res, next) => {
    Producer.create(req.body)
    .then(producer => {
        console.log('Producer Created', producer);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(producer);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /producers ');
})
// authenticate for only admin? 
.delete((req, res, next) => {
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
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /producers/${req.params.producerId}`);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Producer.findByIdAndDelete(req.params.producerId)
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
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /producers/${req.params.producerId}`);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Producer.findByIdAndDelete(req.params.producerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});
// ........
// producerID/comments:/commentId
// ........
// ........
// ........
// ........


module.exports = producerRouter;