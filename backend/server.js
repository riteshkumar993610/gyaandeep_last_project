const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes  = require("./routes/orderRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth",authRoutes);
app.use("/api/business",businessRoutes);
app.use("/api/products",productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/whatsapp",whatsappRoutes);
app.use("/api/subscription",subscriptionRoutes);

app.get("/",(req,res)=>{
    res.send("Grocery ERP Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log("Server Running at "+PORT);
});