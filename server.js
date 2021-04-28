var express = require("express");
var app = express();
var port = 8008;
var path = require("path")
app.use(express.static("public"));

var bodyParser = require('body-parser');
var MongoClient = require("mongodb").MongoClient
var dbname = "FootWear"
var url = "mongodb://localhost:27017/InventoryManagement"
var db;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
   if (err) return console.log(err)
   console.log("Connected!!");
   db = client.db(dbname);
   app.listen(port, () => {
      console.log("Server listening on port " + port);
   });

});

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/insertproduct", (req, res) => {
   console.log(req.body);
   db.collection("Stock").save(req.body, (err, result) => {
      if (err) return console.log(err)
      console.log("Inserted :" + req.body.category + " ::")
      res.redirect("/stockdetails");
   });
});

app.post("/updateproductfinal", (req, res) => {
   console.log("Updating: ");
   console.log(req.body);
   var myquery = { pid: req.body.pid };
   var newvalues = { $set: { pid: req.body.pid, brand: req.body.brand, category: req.body.category, size: req.body.size, quantity: (Number(req.body.oldq) + Number(req.body.quantity)).toString(), cp: req.body.cp, sp: req.body.sp } };
   db.collection("Stock").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      console.log("1 document updated");
      res.redirect("/stockdetails");

   });
});
app.post("/clearstockfinal", (req, res) => {
   console.log("Deleting: ");
   var myquery = { pid: req.body.pid.toString() };
   db.collection("Stock").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      res.redirect("/stockdetails");

   });

});



app.get('/', function (req, res) {
   res.render("index");
});
app.get("/addproduct", function (req, res) {
   res.render("addproduct");
});
app.get("/updatestock", function (req, res) {
   res.render("updatestock", { details: null })
});
app.get("/clearstock", function (req, res) {
   res.render("clearstock", { details: null });
});

app.post("/updatestockget", function (req, res) {
   var query = { pid: req.body.pid };
   console.log("Requesting for: " + req.body.pid)
   db.collection("Stock").find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render("updatestock", { details: result })

   });
});
app.post("/clearstockget", function (req, res) {
   var query = { pid: req.body.pid };
   console.log("Requesting for: " + req.body.pid)
   db.collection("Stock").find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render("clearstock", { details: result })

   });
});
app.get("/stockdetails", function (req, res) {
   db.collection("Stock").find().toArray((err, results) => {
      if (err) return console.log(err)
      console.log(results);
      res.render("stockdetails", { details: results })
   });

});

















