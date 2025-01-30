const mongoose=require("mongoose");
const express=require("express");
const app=express();
const path=require("path");
const ejsmate=require("ejs-mate");
app.engine("ejs",ejsmate)
const User=require("./module/user");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const session=require("express-session")
const flash=require("connect-flash");
const Hackathon=require("./module/hackthon");
const HackathonRegistration=require("./module/registerhackthon")

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
        const { username, email, password } = req.body;

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
        const newUser = new User({ username, email });
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

app.get("/hackthon/createhackthon",async(req,res)=>{
    
    res.render("Main/createhackthon.ejs");
})

app.post("/hackthon/createhackthon", async (req, res) => {
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

        await newHackathon.save();
        
        res.redirect("/hackthon");

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Show Deatails

app.get("/hackthon/:id",async(req,res)=>{
    const {id}=req.params;
    const listing=await Hackathon.findById(id);
    res.render("Main/show",{listing});
})
// Hackthon Registration
app.get("/hackthon/:id/register",(req,res)=>{
    res.render("Main/registerhackthon.ejs");
})
// Hackthon Register
// app.post("/register", (req, res) => {
//     const { team, name, email, phone, teamMembers, project } = req.body;
    
//     // Parse team members from the form
//     const members = [];
//     for (let i = 2; i <= parseInt(teamMembers); i++) {
//         members.push({
//             name: req.body[`member${i}-name`],
//             email: req.body[`member${i}-email`],
//             phone: req.body[`member${i}-phone`]
//         });
//     }
    
//     // Create a new hackathon registration object
//     const newRegistration = new HackathonRegistration({
//         teamName: team,
//         leader: {
//             name: name,
//             email: email,
//             phone: phone
//         },
//         teamMembers: members,
//         projectIdea: project
//     });

//     // Save the new registration to the database
//     newRegistration.save()
//         .then((savedRegistration) => {
//             // res.redirect("/hackthon/success"); 
//             res.send("OK")
//         })
//         .catch((err) => {
//             console.error("Error saving registration:", err);
//             res.status(500).send("Error saving registration. Please try again.");
//         });
// });
app.post("/register", (req, res) => {
    const { team, name, email, phone, teamMembers, project } = req.body;
    
    // Initialize an empty array for team members
    const members = [];
    
    // Check the number of team members selected in the dropdown
    for (let i = 2; i <= parseInt(teamMembers); i++) {
        // Push the details of each team member (name, email, and phone)
        members.push({
            name: req.body[`member${i}-name`],  // Get member name
            email: req.body[`member${i}-email`],  // Get member email
            phone: req.body[`member${i}-phone`]  // Get member phone number
        });
    }
    
    // Create a new hackathon registration object
    const newRegistration = new HackathonRegistration({
        teamName: team,  // Team name
        leader: {
            name: name,  // Leader name
            email: email,  // Leader email
            phone: phone,  // Leader phone number
        },
        teamMembers: members,  // Add the members array
        projectIdea: project  // Project idea
    });

    // Save the new registration to the database
    newRegistration.save()
        .then((savedRegistration) => {
            // Redirect to a success page or show a success message
            // res.redirect("/hackthon/success");
            res.send("OK")
        })
        .catch((err) => {
            console.error("Error saving registration:", err);
            res.status(500).send("Error saving registration. Please try again.");
        });
});

app.get("/flatmate",(req,res)=>{
    res.send("Flatemate")
})
app.get("/event",(req,res)=>{
    res.send("Event")
})

app.get("/",(req,res)=>{
    res.send("Hi i Am Root!")
})



app.listen(8080,(req,res)=>{
    console.log("App Listen On 8080")
})