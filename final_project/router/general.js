const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  if (username) {
    if (users[username]) {
      return res.status(409).json({ message: "User already exists" });
    }
    users[username] = {
        "username": username,
        "password": req.body.password,
      }
    res.send("The user" + (' ') + (username) + ' has been added')
    }
  return res.status(400).send("Username is required.");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = Object.values(books).filter(book => book.author === author);
  return res.send(JSON.stringify(booksByAuthor));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = Object.values(books).filter(book => book.title === title);
  return res.send(JSON.stringify(booksByTitle));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookReviews = books[isbn].reviews;
  return res.send(JSON.stringify(bookReviews));
});

module.exports.general = public_users;
