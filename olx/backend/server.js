require('dotenv').config();

const express = require("express");
const app = express();
const cors = require('cors');
const connectDB = require("./MajorBuySell/DB/db");

const authRoutes = require("./MajorBuySell/Routes/auth.route");
const listingRoutes = require("./MajorBuySell/Routes/listing.route");
const userRoutes = require("./MajorBuySell/Routes/user.route");
const reviewRoutes = require("./MajorBuySell/Routes/review.route"); // Import review routes

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes); // Use review routes

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
  });
});