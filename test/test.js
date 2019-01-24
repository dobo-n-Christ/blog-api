const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function() {
    before(function() {
        return runServer;
    });
    after(function () {
        return closeServer;
    });
    it('should list blog posts on GET', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.above(0);
            const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
            res.body.forEach(function(blogPost) {
                expect(blogPost).to.include.keys(expectedKeys);
            });
        });
    });
    it('should create a blog post on POST', function() {
        const newPost = {
            title: "My Thoughts",
            content: "This is the greatest blog ever!!",
            author: "Enthused"
        };
        return chai.request(app)
        .post('/blog-posts')
        .send(newPost)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            const expectedKeys = ['id', 'title', 'content', 'author'];
            expect(res.body).to.include.keys(expectedKeys);
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(
                Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate})
            );
        });
    });
    it('should update a blog post on PUT', function() {
        const updatePost = {
            title: "Newness",
            content: "For all is newness here.",
            author: "New",
            publishDate: "It's a mystery, isn't it?"
        };
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            updatePost.id = res.body[0].id;
            return chai.request(app)
            .put(`/blog-posts/${updatePost.id}`)
            .send(updatePost)
        })
        .then(function(res) {
            expect(res).to.have.status(204);
        });
    });
    it('should delete a blog post on DELETE', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
        })
        .then(function(res) {
            expect(res).to.have.status(204);
        });
    });
});