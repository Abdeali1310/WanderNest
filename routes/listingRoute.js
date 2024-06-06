const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares/auth");

const {
  showAllListings,
  createNewListForm,
  createNewList,
  editNewListForm,
  editNewList,
  destroyList,
  showList,
} = require("../controllers/listingController");

router.route("/").get(wrapAsync(showAllListings));

router
  .route("/new")
  .get(isLoggedIn, wrapAsync(createNewListForm))
  .post(isLoggedIn, validateListing, wrapAsync(createNewList));

router
  .route("/:id/edit")
  .get(isLoggedIn, isOwner, wrapAsync(editNewListForm))
  .patch(isLoggedIn, isOwner, validateListing, wrapAsync(editNewList));

router.route("/:id/delete").delete(isLoggedIn, isOwner, wrapAsync(destroyList));

router.route("/:id").get(wrapAsync(showList));

module.exports = router;
