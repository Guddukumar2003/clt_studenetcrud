import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import route from './routes/useRoutes.js';
import dotenv from 'dotenv';

const app = express();
app.use(bodyParser.json());

// Configure CORS to explicitly allow your Netlify frontend origin
// This replaces the generic app.use(cors()); to be more secure and targeted
app.use(cors({
  origin: 'https://cltmernproject.netlify.app',  // Your Netlify frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],     // Common methods for CRUD
  allowedHeaders: ['Content-Type', 'Authorization']  // Common headers
}));

dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.use("/api", route);