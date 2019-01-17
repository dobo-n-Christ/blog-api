const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('Blog1', 'This is the first entry. I love food.', 'BloggerOneFun', 'January 11');
BlogPosts.create('Blog2', 'This is the second entry. I love cheesecake.', 'BloggerTwoBoo');
BlogPosts.create('Blog3', 'This is the third entry. Hey there!', 'BloggerThreeTree');

function validate(requiredFields, req, res) {
    for (i=0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
}

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    validate(requiredFields, req, res);
    const newEntry = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(newEntry);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post entry \`${req.params.id}\``);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['id', 'title', 'content', 'author'];
    validate(requiredFields, req, res);
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });
    res.status(204).end();
});

module.exports = router;