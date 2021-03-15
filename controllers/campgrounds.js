const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary')
const mxbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken = process.env.MAPBOX_TOKEN ;
const geoCoder = mxbxGeocoding({accessToken : mapToken})


module.exports.index = async (req,res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});

    // console.log(req.locals.currentUser);
    // console.log(req.user);
    // res.send('theolynnnfsdf 555588484');
    // const camp = new campground({name : 'My backyard'});
    // const saver = await camp.save();
    // console.log(saver);
}
module.exports.newCampground = (req,res) =>{

    res.render('campgrounds/new');

}

module.exports.createCampground = async (req,res) =>{
    const geoData = await geoCoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url : f.path , filename : f.filename}));
    campground.author = req.user._id ;
    campground.save();
    req.flash("success", "Successfully made a new campground !")
    res.redirect(`/campgrounds/${campground._id}`);
    
    // res.send(geoData.body.features[0].geometry);
    // console.log(geoData.body.features[0].geometry.coordinates)
    // res.send(geoData.body.features[0].geometry.coordinates)
    // console.log(req.body,req.files);
    // if(!nGround) throw new expressError('Invalid campground Data',400);
    // res.send(campground)
    // console.log(campground);
}
module.exports.showCampground = async (req,res) =>{
    const {id} = req.params ;
    let campground = await Campground.findById(id).populate({
        path : 'reviews' , 
        populate : {
            path : 'author'
        } 
    }).populate('author');

    if(!campground){
        req.flash("error", "Couldn't find campground");
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground});
   
    // console.log(campground);
    // res.render('campgrounds/show')
    // console.log();
    // console.log(id);
    // console.log(campground);
}

module.exports.showEdit = async (req,res) =>{
    const {id} = req.params ;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error", "Couldn't find campground");
        res.redirect('/campgrounds')
    }


    res.render('campgrounds/edit',{campground})
    
    // const ground = campground.location;
    // campground.city = ground.substring(0,ground.indexOf(','));
    // campground.state = ground.substring(ground.indexOf(',')+1);
 
}


module.exports.submitEdit = async (req,res,next) =>{
    const {id} = req.params ;
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground,{ runValidators: true, new: true });
    const imgs = req.files.map(f => ({url : f.path , filename : f.filename}));
    campground.images.push(...imgs);
    await campground.save();

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
       await campground.updateOne({$pull: {images : {filename : {$in : req.body.deleteImages}}}})
    }
    
    req.flash("success", "Successfully updated campground !")
    res.redirect(`/campgrounds/${id}`);

    // if(!req.body.campground) throw new expressError('Invalid campground Data',400)
    // console.log(nGround);
} 

module.exports.deleteCamp = async (req,res) => {
    const {id} = req.params ; 
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a campground")
    res.redirect('/campgrounds');

}