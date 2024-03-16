import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the testing server for beCared' });
});

app.get('/message', (req, res) => {
    res.json({ message: 'Hello from server!' });
});


// Start server
app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
});