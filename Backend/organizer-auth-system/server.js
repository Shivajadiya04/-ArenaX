/*const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const Organizer = require("./models/Organizer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// ==================== ROUTES ====================

// Home (redirect to login)
app.get("/", (req, res) => res.redirect("/login"));

// Signup
app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await Organizer.create({ name, email, password: hash });
  res.redirect("/login");
});

// Login
app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Organizer.findOne({ email });
  if (!user) return res.send("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Incorrect password");

  req.session.organizer = user;
  res.redirect("/dashboard");
});


// Dashboard                                          
app.get("/dashboard", (req, res) => {
  if (!req.session.organizer) return res.redirect("/login");
  res.render("dashboard", { organizer: req.session.organizer });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
app.use(express.static('public'));
res.render('login', { error: "Invalid credentials" });



// Organizer signup controller
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Form Data:", name, email); // 👈 ye line add karo

    // ...baaki ka code...
});
const organizer = new Organizer({ name, email, password: hashedPassword });
await organizer.save(); // 👈 ye line hone chahiye

// Home route (EJS view)
app.get("/home", (req, res) => {
    res.render("home"); // views/home.ejs must exist
  });*/
  


const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const Organizer = require("./models/Organizer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // ✅ Keep this before routes

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Signup
app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await Organizer.create({ name, email, password: hash });
  res.redirect("/home");
});

//home1
app.get("/index", (req, res) => {
    console.log("✅ /home route hit");
    res.render("index");
  });
  

//home
app.get("/home", (req, res) => {
    console.log("✅ /home route hit");
    res.render("home");
  });
  
  
// Login
app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Organizer.findOne({ email });
  if (!user) return res.send("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Incorrect password");

  req.session.organizer = user;
  res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
  if (!req.session.organizer) return res.redirect("/login");

  const contestStats = {
    categories: {
      coding: 4,
      aptitude: 3,
      reasoning: 2,
      verbal: 2,
    },
    dateWise: {
      "2025-04-20": 1,
      "2025-04-21": 3,
      "2025-04-22": 2,
    },
  };

  const totalContests = Object.values(contestStats.categories).reduce((sum, val) => sum + val, 0);

  res.render("dashboard", {
    organizer: req.session.organizer,
    stats: contestStats,
    totalContests,
  });
});


  
  
// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// ✅ Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
