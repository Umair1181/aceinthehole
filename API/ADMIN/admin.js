// const Router = require("express").Router();
// const { TermsAndCondition } = require("../../MODELS");
// Router.post(
//   "/delete-specific-terms-and-condition-against-id",
//   async (req, res) => {
//     let { _id } = req.body;
//     let foundTermsAndConditions = await TermsAndCondition.remove({
//       _id: _id
//     });
//     if (foundTermsAndConditions.n === 1) {
//       return res
//         .json({
//           msg: `TermsAndCondition Removed`,
//           deletedTandC: _id,
//           success: true
//         })
//         .status(200);
//     } else {
//       return res.json({ msg: "Invalid!", success: false }).status(400);
//     }
//   }
// );

// /////////////////////////////////////////////
// Router.post("/add-new-terms-and-condition", async (req, res) => {
//   let { termsAndCondition, isSellerOrUser } = req.body;
//   let message = false;
//   if (termsAndCondition === "") {
//     message = "Invalid termsAndCondition";
//   } else if (isSellerOrUser === "") {
//     message = "Invalid isSellerOrUser";
//   }
//   if (message === false) {
//     let newTermsAndCondition = new TermsAndCondition({
//       termsAndCondition: termsAndCondition,
//       isSellerOrUser: isSellerOrUser
//     });
//     let savedTermsAndCondition = await newTermsAndCondition.save();
//     if (savedTermsAndCondition) {
//       return res
//         .json({
//           msg: `New Terms and Cndition Added for ${
//             isSellerOrUser ? "Seller" : "Buyer"
//           }`,
//           savedTermsAndCondition: savedTermsAndCondition,
//           success: true
//         })
//         .status(200);
//     } else {
//       return res.json({ msg: "Value is Saved", success: false }).status(400);
//     }
//   } else {
//     return res.json({ msg: message, success: false }).status(400);
//   }
// });
// /////////////////////////////////////////////
// Router.post("/show-specific-terms-and-condition", async (req, res) => {
//   let { _id } = req.body;
//   let foundTermsAndConditions = await TermsAndCondition.findOne({
//     _id: _id
//   });
//   if (foundTermsAndConditions !== null) {
//     return res
//       .json({
//         msg: `TermsAndCondition`,
//         foundTAndC: foundTermsAndConditions,
//         success: true
//       })
//       .status(200);
//   } else {
//     return res.json({ msg: "Not Found!", success: false }).status(400);
//   }
// });

// /////////////////////////////////////////////
// Router.post("/show-terms-and-conditions", async (req, res) => {
//   let { isSellerOrUser } = req.body;
//   let foundTermsAndConditions = await TermsAndCondition.find({
//     isSellerOrUser: isSellerOrUser
//   });
//   if (foundTermsAndConditions.length > 0) {
//     return res
//       .json({
//         msg: `${isSellerOrUser ? "Seller's" : "Buyer's"} TermsAndConditions`,
//         foundTAndC: foundTermsAndConditions,
//         success: true
//       })
//       .status(200);
//   } else {
//     return res.json({ msg: "Not Found!", success: false }).status(400);
//   }
// });

// module.exports = Router;
