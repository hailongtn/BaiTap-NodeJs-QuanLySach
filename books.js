const express = require("express");
const router = express.Router();
const Book = require("./models/book");

// Validate input
function validateBook(book) {
  const { isbn, title, author, year, category } = book;
  if (!isbn) return "ISBN is required";
  if (!title) return "Title is required";
  if (!author) return "Author is required";
  if (!category) return "Category is required";
  if (!Number.isInteger(year) || year < 1900) return "Year must be an integer ≥ 1900";
  return null;
}

// 1. GET /books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /books/:isbn
router.get("/:isbn", async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /books
router.post("/", async (req, res) => {
  try {
    const error = validateBook(req.body);
    if (error) return res.status(400).json({ error });

    const existingBook = await Book.findOne({ isbn: req.body.isbn });
    if (existingBook) return res.status(400).json({ error: "ISBN must be unique" });

    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT /books/:isbn
router.put("/:isbn", async (req, res) => {
  try {
    const error = validateBook(req.body);
    if (error) return res.status(400).json({ error });

    const book = await Book.findOneAndUpdate(
      { isbn: req.params.isbn },
      req.body,
      { new: true }
    );

    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE /books/:isbn
router.delete("/:isbn", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ isbn: req.params.isbn });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. GET /books/search?category=...
router.get("/search", async (req, res) => {
  try {
    const category = req.query.category?.toLowerCase();
    if (!category) return res.status(400).json({ error: "Category query is required" });

    const books = await Book.find({
      category: { $regex: category, $options: 'i' }
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. GET /books/sort?by=title|year&order=asc|desc
router.get("/sort", async (req, res) => {
  try {
    const { by, order } = req.query;
    if (!["title", "year"].includes(by) || !["asc", "desc"].includes(order)) {
      return res.status(400).json({ error: "Invalid sort query" });
    }

    const sortQuery = { [by]: order === 'asc' ? 1 : -1 };
    const books = await Book.find().sort(sortQuery);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
