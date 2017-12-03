var express      = require("express"),
methodOverride   = require("method-override"),
expressSanitizer = require("express-sanitizer"),
bodyParser       = require("body-parser"),
mongoose         = require("mongoose"),
app              = express();
//          Application Config
mongoose.connect("mongodb://localhost/blog_app", {useMongoClient: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//  Mongoose-Model-Configuration/Setup
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);


//            Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
})
//            Index Route
app.get("/blogs", function(req,res){
    //    Showcase All Blogs
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//             New Route
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//             Create Route
app.post("/blogs", function(req,res){
    // Create blog post
    Blog.create(req.body.blog, function(err, newBlog){
         if(err){
             res.render("new");
         } else {
             res.redirect("/blogs");
         }
    });
});

//             Show Route
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog:foundBlog});
        }    
    });
});

//            Edit Route
app.get("/blogs/:id/edit", function (req, res){
    // Edit Blog Post
    Blog.findById(req.params.id, function (err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit",{blog:foundBlog});
        }
    });
    
});

//           Update Route
app.put("/blogs/:id", function (req, res){
    // Update Blog Post
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//           Delete Route
app.delete("/blogs/:id", function(req, res){
    // Delete Blog Post
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog app server has started");
});