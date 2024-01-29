const asynchandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../config/generateToken.js");
const registerUser = asynchandler(async (req, res) => {
  const { username, password, email, pic } = req.body;
  if (!username || !password || !email) {
    res.status(400);
    throw new Error("Please provide email,password,username");
  }

  const userExist = await User.findOne({
    email,
  });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name: username,
    email: email,
    password: password,
    pic: pic,
  });
  if (user) {
    res.status(201).json({
      msg: "user succesfully created",
      _id: user._id,
      name: user.name,
      password: user.password,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const authUser = asynchandler(async (req, res) => {
    const {email,password}=req.body;
    const user=await User.findOne({
        email
    })
    if(user && (await user.matchPassword(password)))
    {
        res.status(201).json({
            msg: "user logged in successfully",
            _id: user._id,
            name: user.name,
            password: user.password,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
          });
    }
    else{
        res.send(401)
        throw new Error("invalid email or password")
    }
});

const allusers = asynchandler(async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword).find({
      _id:{$ne :req.user._id}
    });

    res.json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = { registerUser, authUser,allusers };
