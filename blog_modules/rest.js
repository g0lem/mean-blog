var basic = require("./basic_functions");

module.exports = function(app, auth, mongoose){


  var User    =  mongoose.model('User');
  var Post =  mongoose.model('Post');



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

  app.get('*/rest/post/:id', auth.isAuth, function(req,res){


    
    Post.findOne({_id: req.params.id}, function(err, result){

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
    }).sort({date: -1}).skip(parseInt(req.params.number-1)*10).limit(10);

  });


  app.get('*/rest/Search/:query/:number', auth.isAuth, function(req,res){

    var stripedName = req.params.query; //secure it
    
    Post.find({$or: [ {author: {'$regex': stripedName, $options:'i' } }, {title: {'$regex': stripedName, $options:'i' } }, {tags: {'$regex': stripedName, $options:'i' } }, {date: {'$regex': stripedName, $options:'i' } }]}, function(err, result){

      if(!err && result){
        res.send(result);
      }
      else{
        res.send("No results found");
      }
    }).sort({date: parseInt(-1)}).skip(parseInt(req.params.number-1)*10).limit(10);

  });



  app.post('*/rest/create/', auth.isAuth, function(req,res){

    var stripedName = req.params.query; //secure it
    //check here

    if(req.body.title && req.body.content){


      var post = new Post({author: req.cookies.username, title: req.body.title, date: new Date(),  preview: req.body.preview.substring(0,500) + "...",  content: req.body.content, tags: req.body.tags});
      post.save();

    }

  });

  app.post('*/rest/comment/:id', auth.isAuth, function(req,res){


    console.log(req.body);
    Post.where({ _id: req.params.id }).update({ $push : {comments: {author: req.cookies.username, body: req.body.body }}},
          function(err, result){    
            if(err)
              res.send(err);  
            else{
              res.send("success");       
            }
          });

  });




  app.post('*/rest/remove/', auth.isAuth, function(req,res){

    var stripedName = req.params.query; //secure it
    //check here

    if(req.body.password == "BDjdCDTZ9AgdZsxCpPEYqS78"){


      Post.remove({_id: req.body.id}, function(err, result){


      });


    }

});



// var da = new Company({cui:"123"});
// da.save();



}