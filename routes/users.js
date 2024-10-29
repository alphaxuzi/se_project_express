const {celebrate} = require('celebrate');
const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { idSchema } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  params: {
    itemId: idSchema,
  },
}), updateProfile)

module.exports = router;
