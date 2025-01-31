const mongoose = require("mongoose");

const passportLocalMongoose=require("passport-local-mongoose")
const userSchema=new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Validates email format
            },
            message: "Invalid email format",
        },
    },
    username: {
        type: String,
        required:true
    },
    mode:{
        type:String,
        required:true
    }
});


userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);




