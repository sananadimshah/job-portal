import usermodel from "../models/userModel.js";

const createuser = async (req, res, next) => {
  let { name, email, password } = req.body;
  let request = ["name", "email", "password"];

  for (let ele of request) {
    if (!req.body[ele]) next(`Please provide ${ele}`);
  }

  let alreadyuser = await usermodel.findOne({ email });
  if (alreadyuser) {
    next("Email Already Register Please Login");
  }
  const user = await usermodel.create(req.body);
  // token
  const token = user.createJWT();

  return res.status(201).send({
    status: true,
    message: "User Successfully created",
    user: {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next("Please Provide All Fields");
  }
  const user = await usermodel.findOne({ email }).select("+password");
  if (!user) {
    next("Invalid Useraname or password");
  }

  //compare password
  // const isMatch = await user.comparePassword(password);
  // if (!isMatch) {
  //   next("Invalid Useraname or password");
  // }
  user.password = undefined;
  const token = user.createJWT();
  res.status(201).send({
    status: true,
    massage: "Login Successfully",
    user,
    token: token,
  });
};

const updateUser = async (req, res, next) => {
  let { name, lastname, email, location } = req.body;
  if (!name || !lastname || !email || !location) {
    next("Please Provide All Fields");
  }
  let user = await usermodel.findOne({ _id: req.user.userId });
  user.name = name;
  user.lastname = lastname;
  user.email = email;
  user.location = location;
  await user.save();

  const token = user.createJWT();
  res.status(200).json({
    user,
    token,
  });
};
export { createuser, login, updateUser };
