const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You Must Login First')
        return res.redirect('/user/login')
    }
    next();
}

module.exports =  {isLoggedIn}