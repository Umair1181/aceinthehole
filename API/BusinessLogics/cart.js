// const { Cart } = require("../../MODELS");
// class cart {
//   constructor() {
//     this.inCart = false;
//   }
//   async checkInCart(serviceID, userID) {
//     await Cart.findOne({ user: userID, "items.service": serviceID })
//       .then((fInCart) => {
//         if (fInCart !== null) {
//           console.log("Cart Found");
//           this.inCart = true;
//           console.log("this.inCart");
//           console.log(this.inCart);
//         } else {
//           this.inCart = false;
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         console.log("Catch error of finding service form cart");
//         this.inCart = false;
//       });
//     return this;
//   }
// }
// module.exports = cart;
