const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','You Must Login First')
        return res.redirect('/user/login')
    }
    next();
}

const redirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
} 
module.exports =  {isLoggedIn,redirectUrl}