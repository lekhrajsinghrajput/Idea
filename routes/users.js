const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const routes =  express.Router();

//Loading the model
require('../models/User');
const User = mongoose.model('users');

//user login 
routes.get('/login',(req,res)=>{
  res.render('users/login');
});

//user registration 
routes.get('/register',(req,res)=>{
  res.render('users/register',{errors:[],name:'',email:'',password:'',password2:''});
});

//login form post
routes.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);

})

//register form post
routes.post('/register',(req,res)=>{
  var error =[];
  
  if(req.body.password !=req.body.password2){
    error.push({text:"Passwords do not match!"});
  }

  if(req.body.password.length < 4){
    error.push({text:"Password length should be atleast 4 characters"});
  }

  if(error.length > 0){
    res.render('users/register',{
      errors: error,
      name: req.body.name,
      email:req.body.email,
      password:req.body.password,
      password2:req.body.password2
    });
  }
  else{
    
    User.findOne({email:req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg',"Email already exists");
          res.redirect('/users/login');
        }
        else{
          var newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
          });


          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                newUser.password = hash;
      
                newUser.save()
                  .then(user =>{
                    req.flash('success_msg',"you are now registered user");
                    res.redirect('/users/login');
                  })
                    .catch(err=>{
                      console.log(err);
                      return;
                    })
            });
        });
        }
      })
  }
});

//logout
routes.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success_msg',"Successfully logout");
  res.redirect('/users/login');
})

module.exports = routes;