const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'pages')))

app.get('/graph', (_, res) => {
    res.sendFile(path.join(__dirname, 'graph.html'));
});

app.get('/data', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, '..', 'site_data.json'));
});

app.listen(5000);
console.log('Server is listening on http://localhost:5000');