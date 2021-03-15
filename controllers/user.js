const User = require('../models/user');

module.exports.displayRegister = (req,res) =>{
    res.render("users/register");
}

module.exports.registerUser = async(req,res,next) =>{
    try{
    const {username , email , password} = req.body ;
    const user = new User({username , email});
    const registered = await User.register(user,password);
    req.login(registered, (err) => {
        if(err){
            return next(err);
        }else{
            req.flash('success' , "Welcome to yelpcamp");
            res.redirect('/campgrounds');
        }
    });

}catch(e){
    if(e.message.includes('duplicate key')){
        req.flash('error', 'Email already used');
        res.redirect('register')
    }else{
    req.flash('error', e.message);
    res.redirect('register')
    }
}
    // console.log(registered);

}

module.exports.displayLogin = (req,res) =>{
    res.render("users/login");
}

module.exports.acceptLogin = (req,res) =>{
    // res.send(req.body);
    req.flash('success' , "Welcome Back")
    const redirectUrl = req.session.returnTo || '/campgrounds' ;
    delete req.session.returnTo ;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) =>{
    req.logout();
    req.flash('success' , 'Logout successful')
    res.redirect('/campgrounds');
}