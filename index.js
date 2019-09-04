const express = require('express');
const db = require('./data/db');
const server = express();
//we need this line to be able to get JSON from client
server.use(express.json());

server.post('/api/posts', (req, res) => {
    const post = req.body;

    if (post.title && post.contents) {
        db.insert(post).then(post => res.status(201).json(post)).catch(err => res.status(500).json({error: "There was an error while saving the post to the database"}));
    } else {
        res.status(400).json({errorMessage: "Please provide title and contents for the post."});
    }
});

server.post('/api/posts/:id/comments', (req, res) => {
    const post = req.params.id;
    const comment = req.body;
    if(post){
        if(comment.text){
            db.insertComment(comment)
                .then(comment => res.status(201).json(comment))
                .catch(err => res.status(500).json({ error: "There was an error while saving the comment to the database" }))
        }else {
            res.status(400).json({ errorMessage: "Please provide text for the comment." })
        }

    }else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }

});

server.get('/', (req, res) => {
    res.send('Hay');
});
server.get('/api/posts', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: 'The users information could not be retrieved.',
            });
        });
});

server.get('/api/posts/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res
                    .status(404)
                    .json({message: 'The user with the specified ID does not exist.'});
            }
        })
        .catch(() => {
            res
                .status(500)
                .json({errorMessage: 'The user information could not be retrieved.'});
        });
});

server.get('/api/posts/:id/comments', (req, res) => {
    const post = req.params.id;

    if (post) {
        db.findPostComments(post)
            .then(comments => res.status(201).json(comments))
            .catch(err => res.status(500).json({ error: "The comments information could not be retrieved." }))
    } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }

});

server.delete('/api/posts/:id', (req, res) =>{
    const post = req.params.id;
    if(post){
       db.remove(post)
           .then(res.status(200).json({message: `post № ${post} was deleted`}))
           .catch(err => res.status(500).json({ error: "The post could not be removed" }))
    }else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
});

server.put('/api/posts/:id', (req, res) =>{
    const post = req.params.id;
    if(post){
        if(req.body.title && req.body.contents){
            db.update(post, req.body)
                .then(post => res.status(200).json(req.body))
                .catch(err =>  res.status(500).json({ error: "The post information could not be modified." }))
        }else {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        }
    }else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
});

server.listen(3000, () => console.log('API running on port 3000'));