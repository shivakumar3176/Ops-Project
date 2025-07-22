require('dotenv').config();

const express = require("express");
const app = express();
const cors = require('cors');
const connectDB = require("./MajorBuySell/DB/db");

const authRoutes = require("./MajorBuySell/Routes/auth.route");
const listingRoutes = require("./MajorBuySell/Routes/listing.route");
const userRoutes = require("./MajorBuySell/Routes/user.route");
const reviewRoutes = require("./MajorBuySell/Routes/review.route");

const port = process.env.PORT || 3000;

// --- CORS Configuration ---
const corsOptions = {
  origin: "https://ops-frontend-wrbp.onrender.com", // Your deployed frontend URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// --- End CORS Configuration ---

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
  });
});