var mongoose = require('mongoose');

//**Users**
var usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  sesstoken: {
    type: String,
    default: ""
  },
  posts: [],
  subscribedTo: []

},{collection:"users"});

mongoose.model('User', usersSchema);
//**Users**