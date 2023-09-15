const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const isUserExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){ 
    if(isUserExist(username)){
      return res.status(403).json({message: "User already exists"});
    } else {
      users.push({username: username, password: password});
      return res.status(200).json({message: `User ${username} created`});
    }
  } else {
    return res.status(404).json({message: "Missing username or password"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let the_book = books[req.params.isbn]
  if(the_book){
        return res.send(JSON.stringify(the_book,null,4));
  } else {
        return res.status(404).send("Book with ISBN: " + req.params.isbn + " is not found in database.");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let filteredBooks = Object.values(books).filter(function(items) {
    return items.author.toLowerCase() === req.params.author.toLowerCase();
  });
  if(filteredBooks.length>0){
        return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
        return res.status(404).send(`Can not find books with Author ${req.params.author} in database.`);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let filteredBooks = Object.values(books).filter(function(items) {
    return items.title.toLowerCase() === req.params.title.toLowerCase();
  });
  if (filteredBooks.length > 0){
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).send(`Can not find books with title ${req.params.title} in database.`);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let the_book = books[req.params.isbn];
  if(the_book){
    return res.status(200).send(JSON.stringify(the_book.reviews, null, 4));
  } else{
    return res.status(404).send(`Can not find book with ISBN ${req.params.isbn} in database.`);
  }
});

module.exports.general = public_users;