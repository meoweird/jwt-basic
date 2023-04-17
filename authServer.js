import express, { json } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt, { verify } from "jsonwebtoken";
import verifyToken from "./middleware/auth.js";

const app = express();
app.use(express.json());

let users = [
  {
    id: 1,
    username: "meoweird",
    refreshToken: null,
  },
  {
    id: 2,
    username: "meoweird2",
    refreshToken: null,
  },
];

const generateTokens = (payload) => {
  const { id, username } = payload;
  // ACESS_TOKEN
  const accessToken = jwt.sign({ id, username }, process.env.ACCESS_TOKEN, {
    expiresIn: "2m",
  });

  //REFRESH TOKEN
  const refreshToken = jwt.sign({ id, username }, process.env.REFRESH_TOKEN, {
    expiresIn: "1h",
  });

  return { accessToken, refreshToken };
};

const updateRefreshToken = (username, refreshToken) => {
  users = users.map((user) => {
    if (user.username === username) return { ...user, refreshToken };
    return user;
  });
};

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = users.find((user) => user.username === username);
  if (!user) res.status(401).json("User not found");
  const tokens = generateTokens(user);
  updateRefreshToken(username, tokens.refreshToken);
  console.log(users);
  res.json(tokens);
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) res.status(401);
  const user = users.find((user) => user.refreshToken === refreshToken);
  if (!user) res.status(403);

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const tokens = generateTokens(user);
    updateRefreshToken(user.username, tokens.refreshToken);
    res.json(tokens);
  } catch (error) {
    res.status(403);
  }
});

app.delete("/logout", verifyToken, (req, res) => {
  const user = users.find((user) => user.id === req.userId);
  updateRefreshToken(user.username, null);
  res.status(204);
});

const PORT = 2707;

app.listen(PORT, () => {
  console.log(`Server started at port 2707`);
});
