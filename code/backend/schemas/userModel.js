// const mongoose = require("mongoose");

// const userModel = mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Name is required"],
//     set: function (value) {
//       return value.charAt(0).toUpperCase() + value.slice(1);
//     },
//   },
//   email: {
//     type: String,
//     required: [true, "email is required"],
//   },
//   password: {
//     type: String,
//     required: [true, "password is required"],
//   },
//   type: {
//     type: String,
//     required: [true, "type is required"],
//   },
// },{
//    strict: false,
// });

// const userSchema = mongoose.model("user", userModel);

// module.exports = userSchema;

const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // ensure email uniqueness
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // hides password by default (important for login!)
    },
    type: {
      type: String,
      required: [true, "User type is required"],
      enum: ["Owner", "Renter"], // optional, but good for clarity
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Export the model
module.exports = mongoose.model("User", userSchema);
