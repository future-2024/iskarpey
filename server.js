const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const mariadb = require('mariadb');

dotenv.config();

const app = express();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/balance', require('./routes/api/balance'));
app.use('/api/logs', require('./routes/api/logs'));

// Serve frontend built
app.use(express.static(__dirname + '/client/build'))

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html')
})

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
