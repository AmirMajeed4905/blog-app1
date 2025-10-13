import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";

// import postRoutes from "./routes/postRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

// Database connect
connectDB();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "blogSecret",
  resave: false,
  saveUninitialized: true,
}));
app.use("/uploads", express.static("uploads"));

// View engine
app.set("view engine", "ejs");
app.use(express.static(path.join(path.resolve(), "public")));
app.set("views", path.join(path.resolve(), "views"));
// Routes

// app.use("/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("this is blog project home page");
});
// Error page
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { message: "Something broke!" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
