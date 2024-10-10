import axios from 'axios'; // Import axios
import Crypto from '../models/Crypto.js'; // Import the Crypto model

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const cryptoIds = ['bitcoin', 'ethereum', 'matic-network'];

const fetchCryptoData = async (attempt = 1) => {
    try {
        console.log(`[${new Date().toLocaleString()}] Attempting to fetch cryptocurrency data...`);

        // Fetch data from CoinGecko API
        const response = await axios.get(COINGECKO_API_URL, {
            params: {
                ids: cryptoIds.join(','),
                vs_currencies: 'usd',
                include_market_cap: true,
                include_24hr_change: true
            },
            headers: {
                'Accept': 'application/json',
            }
        });

        console.log('Received response from CoinGecko API:', response.data);

        const data = response.data;

        // Create an array of cryptocurrency documents to be inserted
        const cryptocurrencies = cryptoIds.map(crypto => {
            console.log(`Processing data for ${crypto}:`, data[crypto]);
            return {
                coin: crypto,
                price: data[crypto].usd,
                marketCap: data[crypto].usd_market_cap,
                change24h: data[crypto].usd_24h_change
            };
        });

        console.log('Cryptocurrency documents to be inserted:', cryptocurrencies);

        // Insert the cryptocurrency data into MongoDB
        await Crypto.insertMany(cryptocurrencies);
        console.log('Cryptocurrency data fetched and stored successfully.');

    } catch (error) {
        console.error(`Attempt ${attempt}: Error fetching cryptocurrency data:`, error.message);
        
        // Additional error details
        if (error.response) {
            if (error.response.status === 429) {
                console.error('Rate limit exceeded. Please wait and try again later.');
            } else {
                console.error('Error response from API:', error.response.data);
            }
        } else if (error.request) {
            console.error('Error with the request made to the API:', error.request);
        } else {
            console.error('Error setting up the request:', error.message);
        }

        console.error('Complete error object:', error); // Log the entire error object

        // Retry logic
        if (attempt < 3) { // Increase max attempts if necessary
            console.log(`Retrying... (${attempt + 1}/3)`);
            await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds before retrying
            return fetchCryptoData(attempt + 1); // retry fetching data
        } else {
            console.error('Max attempts reached. Could not fetch data.');
        }
    }
};

export default fetchCryptoData; // Use ES module export
