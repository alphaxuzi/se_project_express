const ClothingItem = require("../models/clothingItem");
const {

  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");
// Clothing Items

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err));
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
     next(new BadRequestError("Missing Required Fields"));
  }

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
         next(new BadRequestError("Something went wrong"));
      }
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        next(new ForbiddenError("You do not have permission"));
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item deleted" })
      );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error loading item"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Something went wrong"));
      }
      next(err);
    });
};

const likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Something went wrong"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Something went wrong"));
      }
      next(err);
    });

const dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Something went wrong"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Something went wrong"));
      }
      next(err);
    });

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
