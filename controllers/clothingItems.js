const ClothingItem = require("../models/clothingItem");

// Clothing Items

const getItems = (req, res) => {
  console.log("GET /items called");
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(404).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl} = req.body;

  ClothingItem.create({name, weather, imageUrl}).then((item) => {
    res.send({data: item})
  }).catch((err) => {
    return res.status(500).send({ message: err.message })
  });

}

module.exports = { getItems, createItem };