import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql";
import cors from "cors";
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("Connected to Database");
});

app.get("/", (req, res) => {
  res.json({ msg: "Hello, Welcome to the backend" });
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books (`title`,`desc`, `price`, `cover`) VALUES (?)";
  const { title, desc, price, cover } = req.body;
  const values = [title, desc, price, cover];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json({ msg: "Book has been created successfully" });
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?";

  const { title, desc, price, cover } = req.body;
  const values = [title, desc, price, cover];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json({ msg: "Book has been updated successfully" });
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json({ msg: "Book has been deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Connected to Server on PORT:${PORT}`);
});
