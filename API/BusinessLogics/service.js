const Wishlist = require("./wishList");
// const { WishList } = require("../../MODELS");

class Service {
  constructor() {
    this.servicesArray = [];
  }

  async checkServiceinWishList(serviceArray, userID) {
    for (let index = 0; index < serviceArray.length; index++) {
      const eachService = serviceArray[index];

      console.log("in Loop of checking servie in wishlist");
      console.log("eachService");
      // console.log(eachService[0]._id);
      let wishListStatus = await new Wishlist().checkinWishList(
        eachService._id,
        userID
      );
      console.log("wishListStatus.inWishList");
      console.log(wishListStatus.inWishList);
      eachService.inWishList = wishListStatus.inWishList;

      this.servicesArray.push(eachService); // preparing the service List
    }

    return this.servicesArray;
  }
}
module.exports = Service;
