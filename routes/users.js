const {celebrate} = require('celebrate');
const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateProfile } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: validateUpdateProfile.user
}), updateProfile)

module.exports = router;
