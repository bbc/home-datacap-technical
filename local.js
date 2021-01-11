const express = require('express');
const path = require('path');
const { handler } = require('./handler');

const app = express();

const handleEvent = async (resourcePath, request, response) => {
    const params = {
        path: request.params,
        querystring: request.query
    };
    const context = {};
    const callback = data => {
        response.setHeader('Content-Type', 'application/json');
        response.json(data);
    }

    handler({ resourcePath, params }, context, callback);
}

app.get('/programmes/episodes', (request, response) => {
    handleEvent('/programmes/episodes', request, response);
});

app.get('/programmes/episodes/:id', (request, response) => {
    handleEvent('/programmes/episodes/{id}', request, response);
});

app.get('/programmes/:id', (request, response) => {
    handleEvent('/programmes/{id}', request, response);
});



app.use('/docs', express.static(path.join(__dirname, 'docs')));

console.log('http://localhost:3000');
app.listen(3000);
