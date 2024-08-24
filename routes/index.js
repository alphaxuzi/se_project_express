const router = require("express").Router();

const userRouter = require("./users");
const itemsRouter = require("./clothingItems");
const { getUsers, createUser, getUser, login, getCurrentUser, updateProfile } = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  NOT_FOUND,
} = require("../utils/errors");
const { getItems } = require("../controllers/clothingItems");


router.use("/users", userRouter);
router.use("/items", itemsRouter);

router.post('/signin', login);
router.post('/signup', createUser)
router.get('/items', getItems)

router.use(auth);

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.get('/users/me', getCurrentUser);
router.patch('/users/me', updateProfile)

router.use((req, res) => {
  res.status(NOT_FOUND).send({message: 'Router not Found'})
})


module.exports = router;