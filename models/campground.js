const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
        url: String,
        filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
   return this.url.replace("/upload", "/upload/c_fill,h_200,w_200")
   
});

ImageSchema.virtual("frontimage").get(function () {
    return this.url.replace("/upload", "/upload/c_fill,h_300,w_300")
    
 });


const opts = { toJSON: { virtuals: true } }
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: { 
                type: String,
                enum: ["Point"],
                required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

CampgroundSchema.virtual("properties.popUpMarkup").get(function() {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})
CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema); //create collection