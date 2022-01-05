const Campground = require("../models/campground");
const cities = require("./cities")
const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/hello-home');
const db = mongoose.connection;
//db connection status->
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random161 = Math.floor(Math.random() * 161);
        const camp = new Campground({
            location: `${cities[random161].city}, ${cities[random161].state}`

        })
        await camp.save();
    }
}
seedDB();