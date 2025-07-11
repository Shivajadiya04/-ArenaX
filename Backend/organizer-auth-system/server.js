
/*const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const Organizer = require("./models/Organizer");
const Contest = require('./models/contest'); // ⬅ Import model at top
const dotenv = require("dotenv");


const SavedContest = require("./models/SavedContest");
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
  const user = await Organizer.findOne({ email }); // You can later check if this is organizer or normal user
  if (!user) return res.send("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Incorrect password");

  req.session.organizer = user;

  // ✅ Check if redirectToContest is stored
  if (req.session.redirectToContest) {
  const contestId = req.session.redirectToContest;
  req.session.redirectToContest = null;

  // ✅ Store contest ID to access in join-dashboard
  req.session.contestToJoin = contestId;

  return res.redirect("/join-dashboard");
}

  res.redirect("/home");
});



// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Unable to destroy the session.");
    }
    res.redirect("/index"); // Redirect to index after logout
  });
});


app.get("/contest-create", (req, res) => {
  if (!req.session.organizer) {
    return res.redirect("/login");  // ✅ Optional redirect
  }
  res.render("contestForm"); // ✅ Correct path
});

app.post('/contest-create', async (req, res) => {
      console.log(req.body); 
   if (!req.session.organizer) {
    return res.status(401).send("Session expired. Please login again.");
  }
  const { title, description, category, timeLimit, startTime, endTime } = req.body;
  const questions = Object.values(req.body.questions);

if (!questions) {
    return res.send("❌ Error: Questions not received in form.");
  }
  // Save contest in DB

  const generatePasscode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const passcode = generatePasscode();

  
  const newContest = await Contest.create({
    title,
    description,
    category,
    timeLimit,
    questions,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    createdBy: req.session.organizer._id,
    createdAt: new Date(),
    passcode
  });

  // Generate contest link using Mongo _id
  const contestLink = `${req.protocol}://${req.get('host')}/contest/${newContest._id}`;

  // Show this link to organizer

  req.session.successMessage = "🎉 Contest created successfully!";
res.redirect("/dashboard");

 // res.send(`<h2>Contest Created Successfully!</h2><p>Share this link:</p><a href="${contestLink}">${contestLink}</a>`);
});

//New route

app.get('/contest/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.send("Contest not found");
// If not logged in, save contestId in session & redirect to login

// Check if logged-in user is organizer of the contest
if (req.session.organizer && contest.createdBy.toString() === req.session.organizer._id.toString()) {
  return res.send("❌ You are the organizer. You cannot attempt your own contest.");
}
    if (!req.session.user) {
      req.session.redirectToContest = req.params.id;
      return res.redirect("/login");
    }
    const now = new Date();

    if (now < contest.startTime) {
      return res.send("⏳ Contest hasn't started yet. Come back later!");
    }

    if (now > contest.endTime) {
      return res.send("⏰ Contest is closed. The time window has passed.");
    }
// Ask passcode on first visit
    res.render("verifyPasscode", {
      contestId: contest._id,
    });

  } catch (err) {
    res.status(500).send("Invalid contest ID");
  }
});

app.post("/contest/verify", async (req, res) => {
  const { contestId, passcode } = req.body;

  const contest = await Contest.findById(contestId);
  if (!contest) return res.send("Contest not found");

  if (contest.passcode !== passcode) {
    return res.send("❌ Invalid Passcode");
  }

  res.redirect(`/contest/attempt/${contestId}`);
});

app.get("/contest/attempt/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const contest = await Contest.findById(req.params.id);
  if (!contest) return res.send("Contest not found");

  // ✅ Organizer check: block organizer from attempting their own contest
  if (contest.createdBy.toString() === req.session.user._id.toString()) {
    return res.send("❌ You are the organizer. You cannot attempt your own contest.");
  }

  res.render("giveContest", { contest });
});

app.post("/contest/:id/join", async (req, res) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) return res.send("Contest not found");
  if (req.body.passcode !== contest.passcode)
    return res.send("Incorrect passcode");

  // Add to user's saved list
  await Contest.updateOne(
    { _id: contest._id },
    { $addToSet: { savedBy: req.session.user._id } }
  );

  res.redirect(`/contest/${contest._id}/start`);
});


app.get("/dashboard", async (req, res) => {
  if (!req.session.organizer) {
    return res.redirect("/login");
  }

  const organizerId = req.session.organizer._id;

  // ✅ Safely fetch created contests
  let createdContests = [];
  try {
    createdContests = await Contest.find({ createdBy: organizerId }).sort({ createdAt: -1 });
  } catch (err) {
    console.error("Error fetching contests:", err);
  }
  
  
  const savedContests = []; 
  const attempted = [];     

  // ✅ Show success message after contest creation
  const successMessage = req.session.successMessage;
  req.session.successMessage = null; // Clear message after use
console.log("Rendering dashboard with user:", req.session.organizer);

  res.render("dashboard", {
    organizer:req.session.organizer, // ✅ Fix this too!
    createdContests,
    savedContests,
    attempted,
    successMessage
  });
});

//join
app.get("/join-dashboard", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const contests = await Contest.find({
    "participants.user": req.session.user._id
  });

  res.render("joinDashboard", { contests });
});




app.post("/contest/save", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  await SavedContest.create({
    userId: req.session.user._id,
    contestId: req.body.contestId
  });

  res.send("✅ Contest saved for later!");
});


app.get("/contest/:id/participants", async (req, res) => {
  if (!req.session.organizer) return res.redirect("/login");

  const contest = await Contest.findById(req.params.id).populate("participants.user");

  // Check if this organizer created the contest
  if (contest.createdBy.toString() !== req.session.organizer._id.toString()) {
    return res.send("❌ You are not authorized to view this data.");
  }

  const sortedParticipants = contest.participants.sort((a, b) => b.score - a.score);

  res.render("contestParticipants", {
    contest,
    participants: sortedParticipants
  });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});*/

//NEW

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const Organizer = require("./models/Organizer");
const User = require("./models/User");
const Contest = require("./models/contest");
const SavedContest = require("./models/SavedContest");

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(console.error);

// ========== Index ==========
app.get("/", (req, res) => res.redirect("/index"));
app.get("/index", (req, res) => res.render("index"));
app.get("/logout", (req, res) => req.session.destroy(() => res.redirect("/index")));

// ========== Organizer Auth ==========
app.get("/organizer/signup", (req, res) => res.render("signup"));
app.post("/organizer/signup", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const org = await Organizer.create({ name: req.body.name, email: req.body.email, password: hash });
  req.session.organizer = org;
  res.redirect("/organizer/home");
});
app.get("/organizer/login", (req, res) => res.render("login"));
app.post("/organizer/login", async (req, res) => {
  const org = await Organizer.findOne({ email: req.body.email });
  if (!org || !(await bcrypt.compare(req.body.password, org.password))) {
    return res.send("Invalid credentials");
  }
  // CLEAR user session if present
  req.session.user = null;
  req.session.organizer = org;
  res.redirect("/organizer/home");
});

// ========== Organizer Home & Flow ==========
app.get("/organizer/home", (req, res) => {
  if (!req.session.organizer) return res.redirect("/organizer/login");
  res.render("organizerHome", { organizer: req.session.organizer });
});
app.get("/contest-create", (req, res) => {
  if (!req.session.organizer) return res.redirect("/organizer/login");
  res.render("contestForm");
});
app.post("/contest-create", async (req, res) => {
  const passcode = Math.random().toString(36).substring(2, 8).toUpperCase();
   console.log("Submitted Start Time:", req.body.startTime);
  console.log("Submitted End Time:", req.body.endTime);
  console.log("Server Current Time:", new Date());
  await Contest.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    timeLimit: req.body.timeLimit,
    questions: Object.values(req.body.questions || []),
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
    createdBy: req.session.organizer._id,
    passcode,
  });
  req.session.successMessage = "Contest created successfully!";
  res.redirect("/dashboard");
});
app.get("/dashboard", async (req, res) => {
  if (!req.session.organizer) return res.redirect("/organizer/login");
  const createdContests = await Contest.find({ createdBy: req.session.organizer._id }).sort({ createdAt: -1 });
  res.render("dashboard", { organizer: req.session.organizer, createdContests, successMessage: req.session.successMessage });
  req.session.successMessage = null;
});
// Organizer Logout
app.get("/organizer/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/index"));
});

// ========== User Auth ==========
app.get("/user/usersignup", (req, res) => res.render("userSignup"));
app.post("/user/usersignup", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  // CLEAR organizer session if present
  req.session.organizer = null;

  const user = await User.create({ name: req.body.name, email: req.body.email, password: hash });
  req.session.user = user;
  res.redirect("/user/home");
});
app.get("/user/userLogin", (req, res) => res.render("userLogin"));
app.post("/user/userLogin", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.send("Invalid credentials");
  }

  //CLEAR organizer session if present
  req.session.organizer = null;

  req.session.user = user;
  if (req.session.redirectToContest) {
    const id = req.session.redirectToContest;
    req.session.redirectToContest = null;
    return res.redirect(`/contest/${id}`);
  }
  res.redirect("/user/home");
});

// ========== User Home & Dashboard ==========
app.get("/user/home", (req, res) => {
  if (!req.session.user) return res.redirect("/user/userLogin");
  res.render("userhomepage", { user: req.session.user });
});
app.get("/join-dashboard", async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userLogin");
  const contests = await Contest.find({ "participants.user": req.session.user._id });
  res.render("joinDashboard", { contests, user: req.session.user});
  req.session.successMessage = null;
});

app.get("/debug-session", (req, res) => {
  res.json({
    user: req.session.user || null,
    organizer: req.session.organizer || null
  });
});


// ========== Contest Attempt ==========
app.post("/join-link", (req, res) => {
  const fullLink = req.body.contestLink.trim();
  const parts = fullLink.split("/");
  const contestId = parts[parts.length - 1];

  if (!contestId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.send("❌ Invalid contest link");
  }

  return res.redirect(`/contest/${contestId}`);
});


app.get("/contest/:id", async (req, res) => {
  const c = await Contest.findById(req.params.id);
  if (!c) return res.send("Contest not found");
  if (req.session.organizer && c.createdBy.toString() === req.session.organizer._id.toString()) {
    return res.send("Organizers can't join own contests");
  }
  if (req.session.organizer && !req.session.user && c.createdBy.toString() === req.session.organizer._id.toString()) {
  return res.send("Organizers can't join own contests");
}

  if (!req.session.user) {
    req.session.redirectToContest = req.params.id;
    return res.redirect("/user/userLogin");
  }
  const now = new Date();
  if (now < c.startTime) return res.send("Contest hasn't started.");
  if (now > c.endTime) return res.send("Contest has ended.");
  res.render("verifyPasscode", { contestId: c._id });
});
app.post("/contest/verify", async (req, res) => {
  const c = await Contest.findById(req.body.contestId);
  if (!c || c.passcode !== req.body.passcode) return res.send("Invalid passcode");
  res.redirect(`/contest/attempt/${c._id}`);
});
app.get("/contest/attempt/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userLogin");
  const c = await Contest.findById(req.params.id);
  if (!c) return res.send("Contest not found");

  return res.render("giveContest", { contest: c });
});

app.post("/contest/attempt/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userLogin");

  const contest = await Contest.findById(req.params.id);
  if (!contest) return res.send("Contest not found");
 const Answers = req.body; //
  let score = 0;
  const submittedAt = new Date();
// Calculate score
  contest.questions.forEach((q, idx) => {
    const userAnswer = answers[`q${idx}`];
    if (userAnswer && userAnswer.trim() === q.answer.trim()) {
      score += 1;
    }
  });

  // Save participant data
  contest.participants.push({
    user: req.session.user._id,
    name: req.session.user.name,
    score,
    submittedAt: new Date() 
  });

  await contest.save();
req.session.successMessage = `✅ Contest submitted successfully with score: ${score}`;
  res.redirect("/join-dashboard");
});


app.post("/contest/submit", async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userLogin");

  const contest = await Contest.findById(req.body.contestId);
  if (!contest) return res.send("Contest not found");

  // Calculate score
  let score = 0;
  contest.questions.forEach((q, idx) => {
    const userAnswer = req.body[`q${idx}`];
    if (userAnswer && userAnswer === q.correct) {
      score += 1;
    }
  });

  // Save submission in participants array
  await Contest.findByIdAndUpdate(req.body.contestId, {
    $push: {
      participants: {
        user: req.session.user._id,
        name: req.session.user.name,
        score: score,
        submittedAt: new Date()
      }
    }
  });

  req.session.successMessage = `Contest submitted successfully! Your score: ${score}`;
  res.redirect("/join-dashboard");
});


/*if (new Date(req.body.endTime) <= new Date(req.body.startTime)) {
  return res.send("❌ End time must be after start time.");
}*/


// User Logout
app.get("/user/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/index"));
});

// ========== Start Server ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

