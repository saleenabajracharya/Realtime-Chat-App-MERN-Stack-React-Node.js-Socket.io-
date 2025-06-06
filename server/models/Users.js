const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName : {
        type:String,
        required: true,
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    token:{
        type: String,

    }
});

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);module.exports = Users;