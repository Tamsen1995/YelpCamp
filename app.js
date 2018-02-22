var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");


seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
	res.render("landing")
});

// INDEX RESTful convention
// retrieving campgrounds from the db
app.get("/campgrounds", function (req, res) {

	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", { campgrounds: allCampgrounds });
		}
	});
});

// CREATE RESTful convention
app.post("/campgrounds", function (req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description
	var newCampGround = { name: name, image: image, description: desc }
	// Create new campground and save to db
	Campground.create(newCampGround, function (err, newlyCreated) {
		if (err) {
			console.log(err)
		} else {
			res.redirect(303, "/campgrounds")
		}
	});
	// redirect to the campgrounds page
});


app.get("/campgrounds/new", function (req, res) {
	res.render("new.ejs");
});


// SHOW RESTful convention
//displaying especific campground
app.get("/campgrounds/:id", function (req, res) {
	//find campground with id
	Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {

		if (err) {
			console.log(err);
		} else {
			res.render("show", { campground: foundCampground });
		}
	});
})

const port = process.env.PORT || 5000

app.listen(port, process.env.IP, function () {
	console.log("The YelpCamp server is running")
});