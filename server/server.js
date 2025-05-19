// server.js
const express = require('express');
const cors = require('cors');
const loginRoutes = require('./routes/loginRoutes');
const userAccountRoutes = require('./routes/userAccountRoutes');//for user account routes
const userProfileRoutes = require('./routes/userProfileRoutes'); //for user profile routes
const cleanerService = require('./routes/cleanerServiceRoutes');  //for cleaner service routes
const serviceCategoryRoutes = require('./routes/serviceCategoryRoutes'); //for service category routes
const homeownerRoutes = require('./routes/homeownerRoutes'); //for homeowner routes
const shortlistRoutes = require('./routes/shortlistRoutes'); //for shortlist service routes
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/login', loginRoutes);

app.use('/api/users', userAccountRoutes);//for user account routes
app.use('/api/profiles', userProfileRoutes); //for user profile routes
app.use('/api/cleaner', cleanerService); //for cleaner service routes
app.use('/api/servicecategory', serviceCategoryRoutes); //for service category routes
app.use('/api/homeowner', homeownerRoutes); //for homeowner routes
app.use('/api/shortlists', shortlistRoutes); //for shortlist service routes

app.listen(5000, () => console.log('Server running on port 5000'));

