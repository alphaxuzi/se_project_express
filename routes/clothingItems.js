const router = require("express").Router();
const { celebrate } = require("celebrate");
const auth = require("../middlewares/auth");
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { clothingItemSchema, idSchema } = require("../middlewares/validation");

router.post(
  "/",
  auth,
  celebrate({
    body: clothingItemSchema.clothingItem,
  }),
  createItem
);
router.delete(
  "/:itemId",
  celebrate({
    params: {
      itemId: idSchema,
    },
  }),
  deleteItem
);

router.put(
  "/:itemId/likes",
  celebrate({
    params: {
      itemId: idSchema,
    },
  }),
  likeItem
);
router.delete(
  "/:itemId/likes",
  celebrate({
    params: {
      itemId: idSchema,
    },
  }),
  dislikeItem
);

module.exports = router;
