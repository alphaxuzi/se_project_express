const router = require("express").Router();
const {getItems, createItem} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", () => {
  console.log("DELETE items");
});

module.exports = router;
