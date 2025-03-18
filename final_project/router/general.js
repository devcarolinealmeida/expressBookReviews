const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(400).send("Username is required.");
});

// Get the book list available in the shop
/* public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
}); */

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books available");
    }
  })
    .then((booksData) => res.send(JSON.stringify(booksData, null, 4)))
    .catch((err) => res.status(500).send(err));
});


// Get book details based on ISBN
/* public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
 }); */

 // Get book details based on ISBN using Promise callbacks
 public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
    .then((bookData) => res.send(JSON.stringify(bookData, null, 4)))
    .catch((err) => res.status(500).send(err));
});


  
// Get book details based on author
/* public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = Object.values(books).filter(book => book.author === author);
  return res.send(JSON.stringify(booksByAuthor));
}); */

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found for the author");
    }})
    .then((booksByAuthor) => res.send(JSON.stringify(booksByAuthor, null, 4)))
    .catch((err) => res.status(500).send(err));
  })

// Get all books based on title
/* public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = Object.values(books).filter(book => book.title === title);
  return res.send(JSON.stringify(booksByTitle));
});*/

// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found for the title");
    }
  })
    .then((booksByTitle) => res.send(JSON.stringify(booksByTitle, null, 4)))
    .catch((err) => res.status(500).send(err));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookReviews = books[isbn].reviews;
  return res.send(JSON.stringify(bookReviews));
});

module.exports.general = public_users;
