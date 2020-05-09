const Cart = require("./cart");

class Service {
  constructor() {
    this.service = [];
  }

  async checkServiceInCart(serviceArray, user) {
    for (let index = 0; index < serviceArray.length; index++) {
      const service = serviceArray[index];
      console.log("Before");
      //checking in cart exist
      let cartStatus = await new Cart().checkInCart(service._id, user);
      service.inCart = cartStatus.inCart;

      this.service.push(service); // preparing the service List
    }

    return this.service;
  }
}
module.exports = Service;
