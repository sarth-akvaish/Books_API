import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.js';
import sellerRoutes from './routes/sellerAuth.js';
dotenv.config();
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use("/api/auth/users", authRoutes);
app.use("/api/auth/sellers", sellerRoutes);

app.get('/', (req, res) => {
    res.send('Books API is running')
})

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});
