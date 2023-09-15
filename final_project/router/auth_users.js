const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
  let the_user = users.filter((user)=>{
    return (user.username === username) && (user.password === password);
  });
  if((the_user.length > 0) && (the_user.length < 2)){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  } 
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({data: password}, 'access', { expiresIn: '1h' });
    req.session.authorization = {accessToken, username};
    return res.status(200).json({message: "User logged in successfully"});
  } else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 let the_book = Object.values(books).filter(function(items){
    return items.isbn == req.params.isbn;
  });
  if(the_book.length>0){
    let username = req.session.authorization.username;
    let reviewContent = req.query.review;
    let now = new Date();
    let date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    let review = {"review": reviewContent, "date": date};
    console.log(reviewContent);
    the_book[0].reviews[username] = review;
    console.log(the_book);
    console.log(the_book[0].reviews[username])
    return res.status(200).json({message: "Review added successfully"});
  } else {
    return res.status(404).json({message: "Book with " + req.params.isbn + " not found."});
  }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let the_book = Object.values(books).filter(function(items){
        return items.isbn == req.params.isbn;
      });
  if(the_book.length>0){
    let username = req.session.authorization.username;
    if(the_book[0].reviews[username]){
      delete the_book[0].reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
    } else {
      return res.status(404).json({message: "Review not found"});
    }
  } else {
    return res.status(404).json({message: "Book with " + req.params.isbn + " not found."});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
