var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


// SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function (req, res) {
	res.render("landing")
});

// retrieving campgrounds from the db
app.get("/campgrounds", function (req, res) {

	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds", { campgrounds: allCampgrounds });
		}
	});
});

app.post("/campgrounds", function (req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var newCampGround = { name: name, image: image }
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

const port = process.env.PORT || 5000

app.listen(port, process.env.IP, function () {
	console.log("The YelpCamp server is running")
});