const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; 

const isValid = (username)=>{ //returns boolean
    let userSameName = users.filter((user) =>{
        return user.username === username
    });
    if(userSameName.length > 0){
        return true;
    }
    else{
        return false;
    }
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter((user) =>{
        return (user.username === username && user.password === password)
    });
    if (validUsers.length > 0){
        return true;
    }
    else{
        return false;
    }
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password){
      res.status(404).json({message:"Error logging in"});
  }

  if(authenticatedUser(username,password)){
      let accessToken = jwt.sign({
          data:password},"access",
      {expiresIn: 60*60 });
      req.session.authorization = {accessToken,username}
      return res.status(200).json({message:"User succesfully logged in"});  
    }
  else{
    return res.status(208).json({message:"Invalid login. Check username and password"});
  } 
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let username = req.session.authorization['username'];
  let review = req.body.review;
  if(books[isbn]){
    let put_review = books[isbn]['reviews'][username] = review;
    res.send("review added");
  }
  else{
    res.send("couldn´t find book with that isbn");
  }  
  //res.send(put_review)
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization['username'];
    if(books[isbn]){
        delete books[isbn]['reviews'][username];
        res.send("review deleted");
    }
    else{
        res.send("couldn´t find a review with that username in the book reviews");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
