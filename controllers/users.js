const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (avatar) updateFields.avatar = avatar;

  User.findByIdAndUpdate(userId, updateFields, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Something went wrong"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Something went wrong"));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findOne({ _id: userId })
    .orFail()
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError('Email already exists'));
      }
      return bcrypt.hash(password, 8);
    })
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Something went wrong"));
      }
      if (err.code === 11000) {
        next(new ConflictError("Something went wrong"));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
