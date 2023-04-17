import express, { json } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import verifyToken from "./middleware/auth.js";

const app = express();
app.use(express.json());

const posts = [
  {
    userId: 1,
    post: "meoweird",
  },
  {
    userId: 2,
    post: "meoweird2",
  },
  {
    userId: 1,
    post: "meoweird1 dep trai",
  },
];

app.get("/posts", verifyToken, (req, res) => {
  res.json(posts.filter((post) => post.userId === req.userId));
});

const PORT = process.env.PORT || 1706;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
