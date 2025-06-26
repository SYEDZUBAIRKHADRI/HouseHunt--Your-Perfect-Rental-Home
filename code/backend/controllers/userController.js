const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userModel");
const propertySchema = require("../schemas/propertyModel");
const bookingSchema = require("../schemas/bookingModel");

//////////////////// REGISTER ////////////////////
const registerController = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    const existsUser = await userSchema.findOne({ email });
    if (existsUser) {
      return res.status(400).send({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      ...req.body,
      password: hashedPassword,
      granted: type === "Owner" ? "ungranted" : undefined,
    };

    const newUser = new userSchema(newUserData);
    await newUser.save();

    return res.status(201).send({ message: "Registered successfully", success: true });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

//////////////////// LOGIN ////////////////////

// const loginController = async (req, res) => {
//   try {
//     console.log("👉 Email received:", req.body.email);
//     console.log("👉 Password received:", req.body.password);

//     const user = await userSchema.findOne({ email: req.body.email });
//     console.log("👉 Found user:", user); // ✅ Now it's defined

//     if (!user || !user.password) {
//       return res
//         .status(401)
//         .send({ message: "User not found or password missing", success: false });
//     }

//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) {
//       return res
//         .status(401)
//         .send({ message: "Invalid email or password", success: false });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     user.password = undefined; // Don't send password back

//     return res.status(200).send({
//       message: "Login successful",
//       success: true,
//       token,
//       user,
//     });

//   } catch (error) {
//     console.log("Login error:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };


const loginController = async (req, res) => {
  try {
    console.log("👉 Email received:", req.body.email);
    console.log("👉 Password received:", req.body.password);

    const user = await userSchema.findOne({ email: req.body.email });

    console.log("👉 Found user:", user);

    if (!user || !user.password) {
      return res
        .status(401)
        .send({ message: "User not found or password missing", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Create safe user object
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      granted: user.granted || "granted", // handle missing granted field
    };

    return res.status(200).send({
      message: "Login successful",
      success: true,
      token,
      user: safeUser, // send trimmed user
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

//////////////////// FORGOT PASSWORD ////////////////////
const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userSchema.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    return res.status(200).send({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error("Forgot Password error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

//////////////////// AUTH CONTROLLER ////////////////////
const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

//////////////////// GET ALL PROPERTIES ////////////////////
const getAllPropertiesController = async (req, res) => {
  try {
    const properties = await propertySchema.find({});
    return res.status(200).send({ success: true, data: properties });
  } catch (error) {
    console.error("Get Properties error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

//////////////////// HANDLE BOOKING ////////////////////
const bookingHandleController = async (req, res) => {
  try {
    const { propertyid } = req.params;
    const { userDetails, status, userId, ownerId } = req.body;

    const booking = new bookingSchema({
      propertyId: propertyid,
      userID: userId,
      ownerID: ownerId,
      userName: userDetails.fullName,
      phone: userDetails.phone,
      bookingStatus: status,
    });

    await booking.save();
    return res.status(200).send({ success: true, message: "Booking successful" });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

//////////////////// GET BOOKINGS FOR USER ////////////////////
const getAllBookingsController = async (req, res) => {
  try {
    const { userId } = req.body;

    const bookings = await bookingSchema.find({ userID: userId });
    return res.status(200).send({ success: true, data: bookings });
  } catch (error) {
    console.error("Get Bookings error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
};
