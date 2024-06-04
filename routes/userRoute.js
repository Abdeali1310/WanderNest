const express = require("express");
const router = express.Router();

const { wrapAsync } = require("../utils/wrapAsync");
const User = require("../models/user");
const expressError = require("../utils/expressError");
const passport = require("passport");
const { redirectUrl } = require("../middlewares/auth");

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
      req.login(registeredUser,(err=>{
        if(err) return next(err)
        req.flash("success", `Hey ${username}, Welcome to Wanderlust`);
        res.redirect("/listings");
      }))
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/user/signup");
    }
  })
);

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',redirectUrl,passport.authenticate ('local',{
    failureRedirect:'/user/login',
    failureFlash: true,
}),async (req,res)=>{
    const {username} = req.body;
    req.flash('success',`Hey ${username}, Welcome Back to Wanderlust`)
    let redirect = res.locals.redirectUrl || '/listings'
    res.redirect(redirect)
})


router.get('/logout',(req,res,next)=>{
  req.logout((err)=>{
    if(err) return next(err)
    req.flash('success','You are Successfully Logged Out')
    res.redirect('/listings')
  })
})
module.exports = router;
