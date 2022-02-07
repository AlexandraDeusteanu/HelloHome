const express = require("express");
const router = express.Router({ mergeParams: true }); //access to id
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError")
const Campground = require("../models/campground");
const { reviewSchema } = require("../schemas.js")
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")



router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash("success", "You successfully wrote a review")
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "You successfully deleted review")
    res.redirect(`/campgrounds/${id}`);

}));
module.exports = router;