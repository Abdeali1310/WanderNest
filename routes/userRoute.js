const express = require("express");
const router = express.Router();

const { wrapAsync } = require("../utils/wrapAsync");
const User = require("../models/user");
const expressError = require("../utils/expressError");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({
        email,
        username,
      });

      const registeredUser = await User.register(newUser, password);
      req.flash("success", `Hey ${username}, Welcome to Wanderlust`);
      res.redirect("/listings");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/user/signup");
    }
  })
);

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',passport.authenticate ('local',{
    failureRedirect:'/user/login',
    failureFlash: true,
}),async (req,res)=>{
    const {username} = req.body;
    req.flash('success',`Hey ${username}, Welcome Back to Wanderlust`)
    res.redirect('/listings')
})

module.exports = router;
