import { Schema } from "mongoose";
import mongoose from "mongoose";
// const userSchema = new Schema(
//     {
//         name: {type : String, required: true},
//         username: {type : String, required: true, unique: true},
//         password: {type: String, required: true},
//         token : {type: String}

//     }
// )

const userSchema = new Schema(
{
  name: {
    type: String,
    required: true
  },

  username: {
    type: String,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String
  },

//   token : {type: String},

  googleId: {
    type: String
  },

  avatar: {
    type: String
  },

  socketId: {
    type: String
  },

  online: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User };



// import mongoose from "mongoose";



// export const User = mongoose.model("User", userSchema);




