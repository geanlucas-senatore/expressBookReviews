const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
      if(!isValid(username)){
          users.push({"username":username,"password":password});
          return res.status(200).json({message:"User succesfully registered"});
      }
      else{
          return res.status(404).json({message:"User already exists"});
      }
  }
  return res.status(404).json({message:"Unable to register user"});
  //return res.status(300).json({message: "Yet to be implemented"});
}); 

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  books_in_json = JSON.stringify(books)
  let myPromise = new Promise((resolve,reject) =>{
      resolve(res.send(books_in_json));
  });
  
  myPromise.then(() => { 
    console.log("get books");
  });
  //return res.status(200).json({message: "all books retrieved"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let myPromise = new Promise((resolve,reject) => {
      resolve(res.send(books[isbn]))
  })
  myPromise.then(() => {
      console.log("get book with that isbn")
  })
  //return res.status(300).json({message: "book retrieved"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let get_books = {}
  for(var book in books){
      if(books[book].author == author){
        get_books[book] = books[book]
      }
  }
  let myPromise = new Promise((resolve,reject) =>{
    resolve(res.send(get_books))
    });
    myPromise.then(() => {
        console.log("get books by author");
    })
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let get_title = {}
  for(var book in books){
      if(books[book].title == title){
          get_title[book] = books[book];
      }
  }
  let myPromise = new Promise((resolve,reject) => {
      resolve(res.send(get_title))
  });
  myPromise.then(() => {
      console.log("get books by title");
  })
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let get_review = books[isbn].reviews
  res.send(get_review);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
