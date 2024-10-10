import mongoose from 'mongoose'; // Use ES Module import

const cryptoSchema = new mongoose.Schema({
  coin: { type: String, required: true },
  price: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  change24h: { type: Number, required: true },
}, { timestamps: true });

const Crypto = mongoose.model('Crypto', cryptoSchema);
export default Crypto; // Use ES Module export
