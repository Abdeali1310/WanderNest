const User = require("../models/user");

const signupForm = async (req, res) => {
  res.render("users/signup");
};

const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({
      email,
      username,
    });

    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Hey ${username}, Welcome to WanderNest`);
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/user/signup");
  }
};

const loginForm = async (req, res) => {
  res.render("users/login");
};

const login = async (req, res) => {
  const { username } = req.body;
  req.flash("success", `Hey ${username}, Welcome Back to WanderNest`);

  let redirectUrl = res.locals.redirectUrl || "/listings";

  // Check if the redirect URL is for a delete route

  const deleteMatchListings = redirectUrl.match(/\/listings\/([^\/]+)\/delete/);
  const deleteMatchReviews = redirectUrl.match(
    /\/listings\/([^\/]+)\/reviews\/([^\/]+)\?_method=DELETE/
  );

  if (
    (deleteMatchListings && redirectUrl.includes("?_method=DELETE")) ||
    (deleteMatchReviews && redirectUrl.includes("?_method=DELETE"))
  ) {
    // If the URL contains "/delete" in either listings or reviews
    redirectUrl = "/listings";
  }

  res.redirect(redirectUrl);
};

const logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are Successfully Logged Out");
    res.redirect("/listings");
  });
};
module.exports = { signupForm, signup, loginForm, login, logout };
