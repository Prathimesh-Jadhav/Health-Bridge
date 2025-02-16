const express = require('express');
const app = express();
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const mongoose = require('mongoose'); // MongoDB ODM (Object Data Modeling)

// Import route handlers
const userRouter = require('./routes/userRoutes');
const hospitalRouter = require('./routes/hospitalRoutes');
const diseaseRouter = require('./routes/diseaseRoutes');
const patientRouter = require('./routes/patientRoutes');
const requestRouter = require('./routes/requestRoutes');
const patientDiseasesRouter = require('./routes/patientDiseasesRoute');

// Import the Gemini API service
const { callGemini } = require('./services/chatgpt');

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected"); // Log successful database connection
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`); // Start the server and log the port
    });
  })
  .catch((err) => {
    console.log(err); // Log any errors during database connection
  });

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Public Routes (accessible without authentication)
app.use('/api/users', userRouter); // Routes for user-related operations

// Private Routes (require authentication)
app.use('/api/hospitals', hospitalRouter); // Routes for hospital-related operations
app.use('/api/diseases', diseaseRouter); // Routes for disease-related operations
app.use('/api/patients', patientRouter); // Routes for patient-related operations
app.use('/api/requests', requestRouter); // Routes for request-related operations
app.use('/api/patientDiseases', patientDiseasesRouter); // Routes for patient-disease-related operations

// Route to call the Gemini API
app.post('/api/callGemini', callGemini); // Endpoint for interacting with the Gemini API