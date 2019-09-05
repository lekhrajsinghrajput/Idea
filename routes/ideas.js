const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Loading the model
require('../models/Idea');
const Idea = mongoose.model('ideas');


//ideas index page
routes.get('/',ensureAuthenticated,(req,res)=>{
  Idea.find({user:req.user.id}).sort({date:'desc'})
    .then(ideas =>{
      res.render('ideas/index',{
        ideas:ideas
      });
    })
  
})

//add ideas
routes.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('ideas/add',{errors:[]});
});

//edit ideas
routes.get('/edit/:id',ensureAuthenticated,(req,res)=>{
  Idea.findOne({
    _id:req.params.id
  })
    .then( idea =>{

      if(idea.user != req.user.id){
        req.flash("error_msg","Not authorized");
        res.redirect('/ideas');
      }
      else{
        res.render('ideas/edit',{idea:idea});
      }
    })  
});

//process form
routes.post('/',ensureAuthenticated,(req,res)=>{
  let errors=[];
  if(!req.body.title){
    errors.push({text:"please enter the title"});
  }
  if(!req.body.details){
    errors.push({text:"please enter the details"});
  }
  if(errors.length > 0){
    res.render('ideas/add',{
      errors:errors,
      title:req.body.title,
      details:req.body.details,
    })
  }
  else{
    const newIdea = new Idea({
      title:req.body.title,
      details:req.body.details,
      user:req.user.id
    });
    newIdea.save()
      .then(idea =>{
        req.flash('success_msg',"Idea has been added!!")
        res.redirect('/ideas');
      })
  }
})

//edit form process
routes.put('/:id',ensureAuthenticated,(req,res)=>{
  Idea.findOne({
    _id:req.params.id
  })
    .then(idea =>{
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          req.flash('success_msg',"Idea has been updated!!")
          res.redirect('/ideas');
        })
    })

})

//delete post
routes.delete('/:id',ensureAuthenticated,(req,res)=>{
  Idea.deleteOne({ _id:req.params.id})
    .then(()=>{
      req.flash('success_msg', "Idea has been successfully deleted!!")
      res.redirect('/ideas');
    })
})

module.exports = routes;