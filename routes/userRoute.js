const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsync");
const passport = require("passport");
const { redirectUrl } = require("../middlewares/auth");

const {
  signupForm,
  signup,
  loginForm,
  login,
  logout,
} = require("../controllers/userController");

//signup Route
router.route("/signup").get(wrapAsync(signupForm)).post(wrapAsync(signup));

//login route
router
  .route("/login")
  .get(wrapAsync(loginForm))
  .post(
    redirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/user/login",
      failureFlash: true,
    }),
    wrapAsync(login)
  );

//logout route
router.route("/logout").get(wrapAsync(logout));

module.exports = router;
