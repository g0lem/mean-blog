var mongoose = require('mongoose');


//**Rooms**
var roomsSchema = new mongoose.Schema({

title: String,
preview: String,
author: String,
date: String,
content: String,
tags: String




},{collection:"posts"});

mongoose.model('Post', roomsSchema);
//**Rooms**