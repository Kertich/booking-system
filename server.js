require ("dotenv").config();
const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/bookings.routes");
const authRoutes = require("./routes/auth.route");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true
}));

app.use(express.json());

app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});