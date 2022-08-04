const express = require('express');
const articleRouter = express.Router();

articleRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the events to you');
})
.post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /article');
    // should be able to post/put/delete your specific comments (not all comments) and not actual information about the article//
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /article ');
})
.delete((req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /article ');
});

module.exports = articleRouter;