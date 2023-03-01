const express = require('express');
const data = require('./data.json');
const app = express();

// variable to make sure image url stays consistent across different routes
const baseUrl = '';

// Set the view engine to Pug
app.set('view engine', 'pug');

// Serve static files from the public directory
app.use('/static', express.static('public'));

// Serve images
app.use('/images' ,express.static(__dirname + '/images'));


// Define routes
app.get('/', (req, res) => {
  res.render('index', { projects: data.projects });
});

app.get('/about', (req, res) => {
  res.render('about');
});


app.get('/project/:id', (req, res, next) => {
  const projectId = parseInt(req.params.id);
  const project = data.projects.find(project => project.id === projectId);
  if (project) {
    res.render('project', { project, baseUrl });
  } else {
    const err = new Error('Project not found');
    err.status = 404;
    next(err);
  }
});

// Error handling middleware
app.use((req, res, next) => {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status || 500);
  res.render('error');
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
