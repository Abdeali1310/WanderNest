const express = require("express");
const router = express.Router();

const { wrapAsync } = require("../utils/wrapAsync");
const User = require("../models/user");
const expressError = require("../utils/expressError");
const passport = require("passport");
const { redirectUrl } = require("../middlewares/auth");

const {
  signupForm,
  signup,
  loginForm,
  login,
  logout,
} = require("../controllers/userController");

//signup form route
router.get("/signup", wrapAsync(signupForm));

//signup route
router.post("/signup", wrapAsync(signup));

//login form route
router.get("/login", wrapAsync(loginForm));

//login route
router.post(
  "/login",
  redirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  wrapAsync(login)
);

//logout route
router.get("/logout", wrapAsync(logout));
module.exports = router;
