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

//listing route
router.get("/", wrapAsync(showAllListings));

//create new list
router.get("/new", isLoggedIn, wrapAsync(createNewListForm));

//handling post request for create
router.post("/new", isLoggedIn, validateListing, wrapAsync(createNewList));

//edit get route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editNewListForm));

//handling put route
router.patch(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(editNewList)
);

//delete route
router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(destroyList));

//show list route
router.get("/:id", wrapAsync(showList));

module.exports = router;
