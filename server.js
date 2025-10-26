import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import Post from "./models/postSchema.js";

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
app.set("views", path.join(path.resolve(), "views"));
app.use(express.static(path.join(path.resolve(), "public")));

// Routes
// app.use("/posts", postRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/add-post", (req, res) => {
  res.render("add-post");
});
app.post("/add-post", async (req, res) => {
  const { title, content, author } = req.body;

  // Basic validation
  if (!title || !content || !author) {
    return res.status(400).send("All fields are required");
  }

  try {
    const newPost = new Post({ title, content, author });
    await newPost.save();

    // Redirect to posts page after creation
    res.redirect("/post"); 
  } catch (error) {
    console.error(error);
    // Render error page instead of JSON for consistency
    res.status(500).render("500", { message: "Error creating post" });
  }
});




app.get("/post", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("post", { posts, page });
  } catch (error) {
    console.error(error);
    res.status(500).render("500", { message: "Error fetching posts" });
  }
});


// Error handling middleware (must be AFTER all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { message: "Something broke!" });
});

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
