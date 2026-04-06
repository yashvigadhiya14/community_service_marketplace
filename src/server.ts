import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { logger } from "./middleware/logger.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import categoryRoute from "./routes/serviceCategoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import ServiceAvailabilityRoutes from "./routes/serviceAvailabilityRoutes.js";
import BookingRoutes from "./routes/bookingRoutes.js";
import ReviewRoutes from "./routes/reviewRoutes.js";
import providerDashboardRoutes from "./routes/providerDashboardRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";

// Swagger
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/AppSwagger.json" with { type: "json" };

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/categories", categoryRoute);
app.use("/api/services", serviceRoutes);
app.use("/api/availability", ServiceAvailabilityRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/review", ReviewRoutes);
app.use("/api/provider", providerDashboardRoutes);
app.use("/api/admindashboard", adminDashboardRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/error", (req, res) => {
  throw new Error("Test error");
});

app.get("/", (req, res) => {
  res.send("demo project");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();