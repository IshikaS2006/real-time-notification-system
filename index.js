import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
dotenv.config();
const app = express();
app.use(express.json());

connectDB();
app.use('/auth', authRoutes); //post requests to /auth/register and /auth/login will be handled by authRoutes

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});