const mongoose=require("mongoose");
const express=require("express");
const methodOverride = require('method-override');
const app=express();
const path=require("path");
const ejsmate=require("ejs-mate");
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate)
const User=require("./module/user");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const session=require("express-session")
const flash=require("connect-flash");
const Hackathon=require("./module/hackthon");
const HackathonRegistration=require("./module/registerhackthon")
const registerhackthon=require("./module/registerhackthon");
const culturalEvent=require("./module/culturalevent");
const SportsEvent=require("./module/sportevent");
const SeminarEvent=require("./module/seminarevent");
const workshopEvent=require("./module/workshopevent");

// Mongoose SetUp
main().then(console.log("Mongoose Connect")).catch((err) => { console.log(err) });
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Hackthon");
}

//express-session
const sessionOption={
    resave:false,
    saveUninitialized:true,
    secret:"PRAJJWALBHAU",
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOption));
app.use(flash());


// Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Flash
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

// Extra
function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to perform this action.");
        return res.redirect("/login");
    }
    next();
}
function isAdmin(req, res, next) {
    if (!req.isAuthenticated() || req.user.mode !== "admin") {
        req.flash("error", "You do not have permission to access this page.");
        return res.redirect("/hackthon");
    }
    next();
}


// Set Views
// Middle Ware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Parser
app.use(express.json());  // For JSON data
app.use(express.urlencoded({ extended: true }));
// Set Public Folder
app.use(express.static(path.join(__dirname,"/public")))

app.get("/hackthon",async(req,res)=>{
    const Hackathondata=await Hackathon.find({});
    res.render("Main/hackthon.ejs",{Hackathondata})
})




// sign
app.get("/signup",(req,res)=>{
    res.render("auth/signup")
})

app.post("/signup", async (req, res) => {
    try {
        const { username, email, password,mode } = req.body;

        // Check if email is provided
        if (!email || email.trim() === "") {
            req.flash('error', 'Email is required!');
            return res.redirect("/signup");
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email});
        if (existingUser) {
            req.flash('error', 'Email already exists. Please use a different one.');
            return res.redirect("/signup");
        }

        // Create a new user if the email is valid and unique
        const newUser = new User({ username, email,mode });
        const registeredUser = await User.register(newUser, password);

        // Automatically log the user in
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to the Hostel App!");
            res.redirect("/hackthon");
        });
        

    } catch (error) {
        req.flash('error', error.message);
        res.redirect("/signup");
    }
});
// Login
app.get("/login",(req,res)=>{
    res.render("auth/login")
})

app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome back!",
}), (req, res) => {
    req.flash("success", "You have login out.");
    res.redirect("/hackthon");
});

// logout
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You have logged out.");
        res.redirect("/hackthon");
    });
});

app.get("/hackthon/createhackthon",isLoggedIn,isAdmin,async(req,res)=>{
    res.render("Main/createhackthon.ejs");
})

app.post("/hackthon/createhackthon",isAdmin,async (req, res) => {
    try {
        const { 
            title, description, startDate, endDate, location, 
            prizePool, categories, rules, maxTeamSize 
        } = req.body;

        

        const newHackathon = new Hackathon({
            title:title,
            description:description,
            startDate:startDate,
            endDate: endDate,
            location:location,
            prizePool: prizePool || 0,
            categories: categories ? categories.split(',').map(c => c.trim()) : [],
            rules: rules ? rules.split(',').map(r => r.trim()) : [],
            maxTeamSize: maxTeamSize || 4,
        });
        newHackathon.owner=req.user._id;
        await newHackathon.save();
        
        res.redirect("/hackthon");

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/",(req,res)=>{
    res.render("layout/main.ejs");
})
// Show Deatails

app.get("/hackthon/:id",async(req,res)=>{
    const {id}=req.params;
    const listing=await Hackathon.findById(id).populate("owner");
    res.render("Main/show",{listing});
})
// Hackthon Registration
app.get("/hackthon/:id/register",(req,res)=>{
    res.render("Main/registerhackthon.ejs");
})
// Hackthon Register
app.get("/register",async(req,res)=>{
    const registerhackthondata=await registerhackthon.find({});
    res.render("Main/showRegisterDetails.ejs",{registerhackthondata})
})
app.post("/register", (req, res) => {
    const { team, name, email, phone, teamMembers, project } = req.body;
    
    // Ensure teamMembers is parsed as an integer
    const numMembers = parseInt(teamMembers, 10);

    const members = [];
    if (numMembers > 1) {  // Ensure there are additional members
        for (let i = 2; i <= numMembers; i++) {
            const memberName = req.body[`member${i}-name`];
            const memberEmail = req.body[`member${i}-email`];
            const memberPhone = req.body[`member${i}-phone`];

            // Ensure all required fields are present
            if (memberName && memberEmail && memberPhone) {
                members.push({
                    name: memberName,
                    email: memberEmail,
                    phone: memberPhone
                });
            }
        }
    }

    // Create a new hackathon registration object
    const newRegistration = new HackathonRegistration({
        teamName: team,
        leader: {
            name: name,
            email: email,
            phone: phone
        },
        teamMembers: members,
        projectIdea: project
    });

    // Save the new registration to the database
    newRegistration.save()
        .then((savedRegistration) => {
            res.redirect("/register");
        })
        .catch((err) => {
            console.error("Error saving registration:", err);
            res.status(500).send("Error saving registration. Please try again.");
        });
});

// Hacthon Registration Show
// Show registered students details for a specific hackathon (admin-only access)
app.get("/hackthon/:id/registerdetails", isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;

    // Find the hackathon by ID and populate the registration details
    const hackathon = await Hackathon.findById(id);
    
    if (!hackathon) {
        req.flash("error", "Hackathon not found.");
        return res.redirect("/hackthon");
    }

    // Fetch the registrations for the specific hackathon
    const registrations = await HackathonRegistration.find({ hackathonId: hackathon._id });

    // Render the registration details page
    res.render("Main/showRegisterDetails", { hackathon, registrations });
});



app.get("/event",(req,res)=>{
    res.render("event/login/index.ejs");
})
// Event Seminar
app.get("/event/seminar",isLoggedIn,isAdmin,(req,res)=>{
    res.render("event/login/seminar.ejs");
})
app.post("/event/seminar",async(req,res)=>{
    try {
        const { eventname, eventdescription, eventinstructions, guestnames, eventdate, eventlocation, eventtime } = req.body;

        // Creating a new seminar event document
        const seminarEvent = new SeminarEvent({
            eventName: eventname,
            eventDescription: eventdescription,
            eventInstructions: eventinstructions,
            guestNames: guestnames,
            eventDate: eventdate,
            eventLocation: eventlocation,
            eventTime: eventtime
        });

        // Saving to the database
        seminarEvent.owner=req.user._id;
        await seminarEvent.save();

       
        res.redirect("/event/seminar/show");
    } catch (error) {
        res.status(500).json({ error: "Error registering seminar event", details: error.message });
    }

})
// Culutural Event
app.get("/event/cultural",isLoggedIn,isAdmin,async(req,res)=>{
   
    res.render("event/login/cultural.ejs");
})
app.post("/event/cultural",async(req,res)=>{
    try {
        const { eventName, eventDescription, eventInstructions, eventDate, eventLocation, eventTime, applicableFor } = req.body;
        
        const newEvent = new culturalEvent({
            eventName,
            eventDescription,
            eventInstructions,
            eventDate,
            eventLocation,
            eventTime,
            applicableFor
        });
        
        newEvent.owner=req.user._id;
        await newEvent.save();
        res.redirect("/event/cultural/show");
    } catch (error) {
        res.status(500).json({ message: "Error registering event", error: error.message });
    }
})
// Sport Event
app.get("/event/sport",isLoggedIn,isAdmin,(req,res)=>{
    res.render("event/login/sport.ejs");
})
app.post("/event/sport",async(req,res)=>{
    try {
        const {
            sportsname,
            sportsoption,
            eventtype,
            eventdate,
            eventlocation,
            applicablefor
        } = req.body;

        // Create a new Sports Event
        const newEvent = new SportsEvent({
            sportsName: sportsname,
            sportsOption: sportsoption,
            eventType: eventtype,
            eventDate: eventdate,
            eventLocation: eventlocation,
            applicableFor: applicablefor
        });

        // Save to database
        newEvent.owner=req.user._id;
        await newEvent.save();

        res.redirect("/event/sport/show");
    } catch (error) {
        res.status(400).json({ message: "Error registering event", error: error.message });
    }
})
// WorkShop
app.get("/event/workshop",isLoggedIn,isAdmin,(req,res)=>{
    res.render("event/login/workshop.ejs");
})
app.post("/event/workshop",async(req,res)=>{
    const { eventname, eventdescription, eventinstructions, guestnames, eventdate, eventlocation, eventtime, applicablefor } = req.body;

    // Creating a new WorkshopEvent instance using the destructured values
    const newEvent = new workshopEvent({
        eventName: eventname,
        eventDescription: eventdescription,
        eventInstructions: eventinstructions,
        guestNames: guestnames,
        eventDate: eventdate,
        eventLocation: eventlocation,
        eventTime: eventtime,
        applicableFor: applicablefor
    });

    // Saving the event to the database
    newEvent.owner=req.user._id;
    newEvent.save()
        .then((savedEvent) => {
            res.redirect("/event/workshop/show");
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error registering event",
                error: err
            });
        });
})
// Show
app.get("/event/cultural/show",async(req,res)=>{
    const culturaldata=await culturalEvent.find({}).populate("owner");
    res.render("event/show/cultural.ejs",{culturaldata})
})
app.get("/event/seminar/show",async(req,res)=>{
    const seminardata=await SeminarEvent.find({}).populate("owner");
    res.render("event/show/seminar.ejs",{seminardata})
})
app.get("/event/sport/show",async(req,res)=>{
    const sportdata=await SportsEvent.find({}).populate("owner");
    res.render("event/show/sport.ejs",{sportdata})
})
app.get("/event/workshop/show",async(req,res)=>{
    const workshopdata=await workshopEvent.find({}).populate("owner");
    res.render("event/show/workshop.ejs",{workshopdata})
})
app.get("/event/seminar/apply",(req,res)=>{
    res.render("event/apply/apply.ejs");
})
app.get("/event/sport/apply",(req,res)=>{
    res.render("event/apply/apply.ejs");
})
app.get("/event/cultural/apply",(req,res)=>{
    res.render("event/apply/apply.ejs");
})
app.get("/event/workshop/apply",(req,res)=>{
    res.render("event/apply/apply.ejs");
})

app.post("event/cultural/apply",(req,res)=>{

})

app.get("/flatmate",(req,res)=>{
    res.render("FlatFind/index.ejs")
})

// Flat Chaecjin
let flatmateRequests = [];

// Endpoint to get flatmate requests
app.get('/api/flatmates', (req, res) => {
    res.json(flatmateRequests);
});

// Endpoint to create a new flatmate request
app.post('/api/flatmates', (req, res) => {
    const { name, phone, college, location, ownerName, ownerPhone, facilities, flatType, rent } = req.body;

    // Ensure the request body is valid before proceeding
    if (!name || !phone || !college || !location || !ownerName || !ownerPhone || !facilities || !flatType || !rent) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest = {
        id: Date.now(),
        name,
        phone,
        college,
        location,
        ownerName,
        ownerPhone,
        facilities,
        flatType,
        rent
    };

    flatmateRequests.push(newRequest);
    res.status(201).json(newRequest);
});

app.listen(8080,(req,res)=>{
    console.log("App Listen On 8080")
})