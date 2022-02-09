const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/hello-home');
const db = mongoose.connection;
//db connection status->
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]

}



const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random161 = Math.floor(Math.random() * 161);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            //MY user id
            author: "62005b7546125824767e2744",
            location: `${cities[random161].city}, ${cities[random161].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/diamqhs7d/image/upload/v1644349932/HelloHome/hrxm41cqa1wkhngbjw00.jpg',
                    filename: 'HelloHome/hrxm41cqa1wkhngbjw00',
                   
                  },
                  {
                    url: 'https://res.cloudinary.com/diamqhs7d/image/upload/v1644349932/HelloHome/au7d2is6tnsz8nsdjfmp.jpg',
                    filename: 'HelloHome/au7d2is6tnsz8nsdjfmp',
                
                  }
            ],
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
            price: price,
            geometry : {   
                 type : "Point", 
                 coordinates : [ 28.63833, 44.17333 ]
         }

        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})