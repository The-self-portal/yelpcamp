const mongoose = require('mongoose');
const campground = require('../models/campground');
const reviews = require('../models/review');
const cities = require('./cities');
const {places , descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelpApp',{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('We are connected to mongo');
    // we're connected!
})
.catch(err => {
    console.log('oh no mongo errorr !');
    console.log(err);
    
})

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
    // console.log(array[Math.floor(Math.random() * 1000) + 1]);


const seedDB = async () =>{
    await campground.deleteMany({});
    await reviews.deleteMany({});
    for(let i = 0 ; i < 300; i++){
        
        let random = Math.floor(Math.random() * cities.length) ;
        let price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            author : '6037c7fb4e89b11b58833197',
            title : `${sample(descriptors)} ${sample(places)}`,
            price : price,
            description : `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore culpa aperiam nemo! Eveniet minima excepturi, vel officia fugiat rem! In, libero tenetur? Dicta, illo. Perferendis deserunt maiores eligendi aliquam voluptas!`,
            location : `${cities[random].city},${cities[random].province}`,
            images :  [
                {
                  url: 'https://res.cloudinary.com/dalok9ito/image/upload/v1614615095/YelpCamp/yj3ucawcdnoeuznu23pf.jpg',
                  filename: 'YelpCamp/yj3ucawcdnoeuznu23pf'
                },
                {
                  url: 'https://res.cloudinary.com/dalok9ito/image/upload/v1614615094/YelpCamp/d0x3xixvsxwv2ohudsft.jpg',
                  filename: 'YelpCamp/d0x3xixvsxwv2ohudsft'
                },
                {
                  url: 'https://res.cloudinary.com/dalok9ito/image/upload/v1614615097/YelpCamp/p27chpua3tuq3o1ys4qr.jpg',
                  filename: 'YelpCamp/p27chpua3tuq3o1ys4qr'
                }
              ],
            geometry: {
              type :'Point',
              coordinates : [parseFloat(cities[random].longitude),parseFloat(cities[random].latitude)]
            }
        });   
        await camp.save();
        
        // console.log(descriptors.length);
        // console.log(places.length);
        // console.log(camp);
        // console.log(cities[random].city);
        // console.log(cities[5].city);
        // console.log(random);
    }
}
seedDB().then(() => {mongoose.connection.close()})
