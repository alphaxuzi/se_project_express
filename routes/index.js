const router = require("express").Router();
const { celebrate } = require("celebrate");
const userRouter = require("./users");
const itemsRouter = require("./clothingItems");
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { getItems } = require("../controllers/clothingItems");

const {createUserSchema, authenticationSchema } = require('../middlewares/validation');
const  {NotFoundError}  = require('../utils/errors');

router.post('/signin', celebrate({
  body: authenticationSchema.user
}), login);
router.post('/signup', celebrate({
  body: createUserSchema.user
}), createUser);
router.get('/items', getItems);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", itemsRouter);


router.use(() => {
  throw new NotFoundError("Router not found");
})


module.exports = router;