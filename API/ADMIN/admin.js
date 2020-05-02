const Router = require("express").Router();
const { TermsAndCondition, Seller } = require("../../MODELS");

Router.post("/show-blocked-sellers-list", (req, res) => {
  Seller.find({ isBlock: true })
    .then((foundSellers) => {
      console.log(foundSellers);
      if (foundSellers.length > 0) {
        return res
          .json({
            msg: "blocked-sellers-list",
            foundSellers,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "Empty", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-rejected-sellers-list", (req, res) => {
  Seller.find({ sellerStatus: "REJECT" })
    .then((foundSellers) => {
      console.log(foundSellers);
      if (foundSellers.length > 0) {
        return res
          .json({
            msg: "rejected-sellers-list",
            foundSellers,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "Empty", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-accepted-sellers-list", (req, res) => {
  Seller.find({ sellerStatus: "ACCEPT" })
    .then((foundSellers) => {
      console.log(foundSellers);
      if (foundSellers.length > 0) {
        return res
          .json({
            msg: "accepted-sellers-list",
            foundSellers,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "Empty", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/show-requested-sellers-list", (req, res) => {
  Seller.find({ sellerStatus: "NEWSELLER" })
    .then((foundNewSellers) => {
      console.log(foundNewSellers);
      if (foundNewSellers.length > 0) {
        return res
          .json({
            msg: "New Requested Sellers",
            foundNewSellers,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({ msg: "No Requested Sellers", success: false })
          .status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/admin-can-block-unblock-any-seller", (req, res) => {
  let { sellerID, isBlock } = req.body;

  Seller.findOne({ _id: sellerID })
    .then((foundSeller) => {
      if (foundSeller !== null) {
        foundSeller.isBlock = isBlock;

        foundSeller
          .save()
          .then((savedSeller) => {
            if (savedSeller) {
              return res
                .json({
                  msg: `Seller is ${
                    savedSeller.isBlock ? "Seller Blocked" : "Seller Unblocked"
                  }`,
                  savedSeller,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: `Seller Not Save`,

                  success: false,
                })
                .status(404);
            }
          })
          .catch((err) => {
            console.log(err);
            return res
              .json({ msg: "Failed save!", success: false })
              .status(505);
          });
      } else {
        return res.json({ msg: "Not Found", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post("/admin-can-accept-reject-newseller", (req, res) => {
  let { sellerID, sellerstatus } = req.body;

  Seller.findOne({ _id: sellerID })
    .then((foundSeller) => {
      if (foundSeller !== null) {
        foundSeller.sellerStatus = sellerstatus;

        foundSeller
          .save()
          .then((savedSeller) => {
            if (savedSeller) {
              return res
                .json({
                  msg: `Seller is ${savedSeller.sellerStatus}`,
                  savedSeller,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({
                  msg: `Seller Not Save`,

                  success: false,
                })
                .status(404);
            }
          })
          .catch((err) => {
            console.log(err);
            return res
              .json({ msg: "Failed save!", success: false })
              .status(505);
          });
      } else {
        return res.json({ msg: "Not Found", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Failed!", success: false }).status(505);
    });
});

Router.post(
  "/delete-specific-terms-and-condition-against-id",
  async (req, res) => {
    let { _id } = req.body;
    let foundTermsAndConditions = await TermsAndCondition.remove({
      _id: _id,
    });
    if (foundTermsAndConditions.n === 1) {
      return res
        .json({
          msg: `TermsAndCondition Removed`,
          deletedTandC: _id,
          success: true,
        })
        .status(200);
    } else {
      return res.json({ msg: "Invalid!", success: false }).status(400);
    }
  }
);

/////////////////////////////////////////////
Router.post("/add-new-terms-and-condition", async (req, res) => {
  let { termsAndCondition, isSellerOrUser } = req.body;
  let message = false;
  if (termsAndCondition === "") {
    message = "Invalid termsAndCondition";
  } else if (isSellerOrUser === "") {
    message = "Invalid isSellerOrUser";
  }
  if (message === false) {
    let newTermsAndCondition = new TermsAndCondition({
      termsAndCondition: termsAndCondition,
      isSellerOrUser: isSellerOrUser,
    });
    let savedTermsAndCondition = await newTermsAndCondition.save();
    if (savedTermsAndCondition) {
      return res
        .json({
          msg: `New Terms and Cndition Added for ${
            isSellerOrUser ? "Seller" : "Buyer"
          }`,
          savedTermsAndCondition: savedTermsAndCondition,
          success: true,
        })
        .status(200);
    } else {
      return res.json({ msg: "Value is Saved", success: false }).status(400);
    }
  } else {
    return res.json({ msg: message, success: false }).status(400);
  }
});
/////////////////////////////////////////////
Router.post("/show-specific-terms-and-condition", async (req, res) => {
  let { _id } = req.body;
  let foundTermsAndConditions = await TermsAndCondition.findOne({
    _id: _id,
  });
  if (foundTermsAndConditions !== null) {
    return res
      .json({
        msg: `TermsAndCondition`,
        foundTAndC: foundTermsAndConditions,
        success: true,
      })
      .status(200);
  } else {
    return res.json({ msg: "Not Found!", success: false }).status(400);
  }
});

/////////////////////////////////////////////
Router.post("/show-terms-and-conditions", async (req, res) => {
  let { isSellerOrUser } = req.body;
  let foundTermsAndConditions = await TermsAndCondition.find({
    isSellerOrUser: isSellerOrUser,
  });
  if (foundTermsAndConditions.length > 0) {
    return res
      .json({
        msg: `${isSellerOrUser ? "Seller's" : "Buyer's"} TermsAndConditions`,
        foundTAndC: foundTermsAndConditions,
        success: true,
      })
      .status(200);
  } else {
    return res.json({ msg: "Not Found!", success: false }).status(400);
  }
});

module.exports = Router;
