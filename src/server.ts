import express from "express"
import path from "path"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import sequelize from "./config/db.js"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger/AppSwagger.json" with { type: "json" };
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import providerRoutes from "./routes/providerRoutes.js"
import cors from "cors";
import categoryRoute from "./routes/serviceCategoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js"
import ServiceAvailabilityRoutes from "./routes/serviceAvailabilityRoutes.js"
import BookingRoutes from "./routes/bookingRoutes.js"
import ReviewRoutes from "./routes/reviewRoutes.js"
import providerDashboardRoutes from "./routes/providerDashboardRoutes.js"
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js"


dotenv.config()
const app=express()

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/provider",providerRoutes)
app.use("/api/categories",categoryRoute)
app.use("/api/services",serviceRoutes)
app.use("/api/availability",ServiceAvailabilityRoutes)
app.use("/api/bookings",BookingRoutes)
app.use("/api/review",ReviewRoutes)
app.use("/api/provider",providerDashboardRoutes)
app.use("/api/admindashboard",adminDashboardRoutes)


await sequelize.sync()

app.get("/",(req,res)=>{
  res.send("demo project")
})



app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument))

sequelize.authenticate()
.then(()=>{
  console.log("Database connected successfully")
})
.catch((error)=>{
  console.error("Database connection failed:", error)
})
app.listen(3000,()=>{console.log(`server is running on port 3000`)})