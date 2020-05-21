const { Reviews, Service } = require("../../MODELS");
class reviews {
  constructor() {
    this.avgRating = 0;
  }
  async calculateServiceRat(sellerID) {
    let sumation = 0;
    let foundServices = await Service.find({ seller: sellerID });
    for (let i = 0; i < foundServices.length; i++) {
      await Reviews.find({ service: foundServices })
        .then((foundReviews) => {
          if (foundReviews.length > 0) {
            for (let k = 0; k < foundReviews.length; k++) {
              sumation = sumation + foundReviews[k].rating;
            }
            let avg = sumation / foundReviews.length;
            // this.avgRating.push(avg);
            foundServices[i].avgRating = avg;
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("Catch error of finding service form cart");
          //   this.inCart = false;
        });
    }
    return foundServices;
  }
}
module.exports = reviews;
