import express from "express"; // Import express
import cron from "node-cron"; // Import node-cron
import fetchCryptoData from "./jobs/fetchCryptoData.js"; // Import fetchCryptoData
import connectDB from './config/db.js'; // Import the connectDB function

const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Cron job to fetch cryptocurrency data every 2 minutes
cron.schedule('*/2 * * * *', async () => {
    console.log('Fetching crypto data...');
    try {
        await fetchCryptoData(); // Await the data fetching function
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error.message); // Log any errors
    }
});

// Root route
app.get("/", (req, res) => {
    res.send("Crypto Tracker is running...");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
