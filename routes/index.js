const router = require("express").Router();

const userRouter = require("./users");
const itemsRouter = require("./clothingItems");

router.use("/users", userRouter);

router.use("/items", itemsRouter);

router.use((req, res) => {
  res.status(404).send({message: 'Router not Found'})
})

module.exports = router;