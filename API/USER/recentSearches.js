// const Router = require("express").Router();
// const { RecentSearches } = require("../../MODELS");

// Router.post("/show-recent-searches-of-specific-user", (req, res) => {
//   let { userID } = req.body;
//   RecentSearches.findOne({ user: userID })
//     .populate({ path: "productPosts" })
//     .then(foundSearches => {
//       if (foundSearches) {
//         let recentProducts = [];
//         let y = foundSearches.productPosts.length - 1;
//         console.log(y);
//         foundSearches.productPosts.forEach(eachPost => {
//           recentProducts.push(eachPost);
//           if (recentProducts.length === 7 || recentProducts.length === y) {
//             return res
//               .json({
//                 msg: "Recent Searched Products!",
//                 foundSearches: recentProducts,
//                 success: true
//               })
//               .status(404);
//           }
//         });
//         // for (let x = y; x >= 0; x--) {
//         //   recentProducts.push(foundSearches.productPosts[x]);
//         //   if (recentProducts.length === 7) {

//         //   }
//         //   // console.log(foundSearches.productPosts[x]);
//         // }
//       } else {
//         return res
//           .json({ msg: "No Recent Search Exist", success: false })
//           .status(400);
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       return res.json({ msg: "Failed!", success: false }).status(505);
//     });
// });

// Router.post("/add-and-update-recent-search-for-a-user", (req, res) => {
//   let { userID, productID } = req.body;
//   RecentSearches.findOne({ user: userID })
//     .then(foundSearches => {
//       if (foundSearches) {
//         console.log(productID);
//         for (let z = 0; z < foundSearches.productPosts.length; z++) {
//           if (
//             foundSearches.productPosts[z].toString() === productID.toString()
//           ) {
//             return res
//               .json({ msg: "Product Already Searched", success: false })
//               .status(404);
//           }
//         }
//         foundSearches.productPosts.push(productID);
//         foundSearches
//           .save()
//           .then(updatedNewSearch => {
//             if (updatedNewSearch) {
//               return res
//                 .json({
//                   msg: "New Search Added in Previous History",
//                   updatedNewSearch: updatedNewSearch,
//                   success: true
//                 })
//                 .status(200);
//             } else {
//               return res.json({ msg: "Not found", success: false }).status(400);
//             }
//           })
//           .catch(err => {
//             console.log(err);
//             return res.json({ msg: "Failed!", success: false }).status(505);
//           });
//       } else {
//         let newRecentSearches = new RecentSearches({
//           user: userID,
//           productPosts: productID
//         });
//         newRecentSearches
//           .save()
//           .then(savednewSearch => {
//             if (savednewSearch) {
//               return res
//                 .json({
//                   msg: "New Search Added!",
//                   savednewSearch: savednewSearch,
//                   success: true
//                 })
//                 .status(200);
//             } else {
//               return res
//                 .json({ msg: "No Search Added!", success: false })
//                 .status(400);
//             }
//           })
//           .catch(err => {
//             console.log(err);
//             return res.json({ msg: "Failed!", success: false }).status(505);
//           });
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       return res.json({ msg: "Failed!", success: false }).status(500);
//     });
// });

// module.exports = Router;
