var basic = require("./basic_functions");

module.exports = function(app, auth, mongoose){


  var User    =  mongoose.model('User');
  var Post =  mongoose.model('Post');


  app.get('*/rest/company/:nume', auth.isAuth, function(req,res){
    
    Company.findOne({$or: [{cui: req.params.nume}, {email: req.params.nume}]}, function(err, result){

      if(result){
        var JSONresponse = {

          cui:        result.cui,
          email:      result.email,
          nume:       result.nume

        }

        res.send(JSONresponse);
      }
      else{
        res.send(null);
      }

    });

  });


//this returns all the reclamations that were registered by ALL companies

  app.get('*/rest/posts', auth.isAuth, function(req,res){


    
    Post.find({}, function(err, result){

      if(!err && result){
        res.send(result);
      }
      else{
        res.send("No results found");
      }
    });

  });


  app.get('*/rest/posts/:number', auth.isAuth, function(req,res){


    
    Post.find({}, function(err, result){

      if(!err && result){
        res.send(result);
      }
      else{
        res.send("No results found");
      }
    }).skip(parseInt(req.params.number-1)*10).limit(10);

  });


  app.get('*/rest/Search/:query/:number', auth.isAuth, function(req,res){

    var stripedName = req.params.query; //secure it
    
    Post.find({$or: [ {author: {'$regex': stripedName, $options:'i' } }, {title: {'$regex': stripedName, $options:'i' } }, {tags: {'$regex': stripedName, $options:'i' } }, {date: {'$regex': stripedName, $options:'i' } }]},, function(err, result){

      if(!err && result){
        res.send(result);
      }
      else{
        res.send("No results found");
      }
    }).skip(parseInt(req.params.number-1)*10).limit(10);

  });



  app.post('*/rest/create/', auth.isAuth, function(req,res){

    var stripedName = req.params.query; //secure it
    //check here


    var post = new Post({author: req.body.author, title: req.body.title, date: new Date(), content: req.body.content, tags: req.body.tags});
    post.save();



  });




// var da = new Company({cui:"123"});
// da.save();



}