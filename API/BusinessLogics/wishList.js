const { WishList } = require("../../MODELS");
class wishlist {
  constructor() {
    this.inWishList = false;
  }
  async checkinWishList(serviceID, userID) {
    await WishList.findOne({ user: userID, services: serviceID })
      .then((foundWishList) => {
        if (foundWishList !== null) {
          console.log("User added service in wishlist");
          this.inWishList = true;
          console.log("inWishList");
          console.log(this.inWishList);
        } else {
          this.inWishList = false;
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Catch error of finding service form WishList");
        this.inWishList = false;
      });
    return this;
  }
}
module.exports = wishlist;
