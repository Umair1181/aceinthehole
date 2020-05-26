const { Reviews, Service, Seller } = require("../../MODELS");
class reviews {
  constructor() {
    this.avgRating = 0;
  }

  async calculateSellerRat(sellerID) {
    let sumation = 0;
    let serviceAvg = 0;
    let servicesLength = 0;
    let sellerAvgRating = 0;
    let avg = 0;
    let foundSellers = await Seller.find();
    for (let j = 0; j < foundSellers.length; j++) {
      if (foundSellers.length > 0) {
        let foundServices = await Service.find({ seller: foundSellers[j]._id });
        servicesLength = foundServices.length;
        for (let i = 0; i < foundServices.length; i++) {
          let foundReviews = await Reviews.find({
            service: foundServices[i]._id,
          });
          // .then((foundReviews) => {
          if (foundReviews.length > 0) {
            for (let k = 0; k < foundReviews.length; k++) {
              sumation = sumation + foundReviews[k].rating;
            }
            avg = sumation / foundReviews.length;
            serviceAvg = serviceAvg + avg;

            // this.avgRating.push(avg);
            // foundServices[i].avgRating = avg;
          }
          // else {
          //   console.log("no rating of this service");
          // }
          // })
          // .catch((err) => {
          //   console.log(err);
          //   console.log("Catch error of finding service form cart");
          //   //   this.inCart = false;
          // });
        }
        // sellerAvgRating = serviceAvg / foundServices.length;
        //
        console.log(foundSellers[j]);
      }
      foundSellers[j].sellerAvgRating = serviceAvg / servicesLength;
    }
    console.log(foundSellers);
    return foundSellers;
  }

  async calculateServiceRat(sellerID) {
    let sumation = 0;
    let foundServices = await Service.find({ seller: sellerID })
      .populate({
        path: "seller",
      })
      .populate({
        path: "category",
      });
    for (let i = 0; i < foundServices.length; i++) {
      let foundReviews = await Reviews.find({ service: foundServices[i]._id });
      let avg = 0;
      // .then((foundReviews) => {
      if (foundReviews.length > 0) {
        for (let k = 0; k < foundReviews.length; k++) {
          sumation = sumation + foundReviews[k].rating;
        }
        avg = sumation / foundReviews.length;
        // this.avgRating.push(avg);
      } else {
        console.log("no rating of this service");
      }
      foundServices[i].avgRating = avg;
      // })
    }
    return foundServices;
  }
}
module.exports = reviews;
