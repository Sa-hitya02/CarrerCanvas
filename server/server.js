const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== CORS SETUP (KEEP ONLY THIS! DELETE/REPLACE ANY OLD app.use(cors())) =====
const allowedOrigins = [
  "http://localhost:3000",
  "https://carrercanvas-frontend.onrender.com" // <-- Your actual deployed frontend domain
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
// ==============================================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'CareerCanvas API is running on Atlas!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
