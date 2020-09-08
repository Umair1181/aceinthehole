const Router = require("express").Router();
const { Seller, User, Admin } = require("../../MODELS");

Router.post("/update-fc-token-of-any-person", (req, res) => {
  let { token } = req.body;

  if (
    token.personType === "" &&
    token.personType === undefined &&
    token.personType === null
  ) {
    return res.json({ msg: "Invalid person type", success: false });
  }
  if (
    token.personID === "" &&
    token.personID === undefined &&
    token.personID === null
  ) {
    return res.json({ msg: "Invalid personID", success: false });
  }
  if (
    token.fcToken === "" &&
    token.fcToken === undefined &&
    token.fcToken === null
  ) {
    return res.json({ msg: "Invalid fcToken", success: false });
  }
  if (
    token.appType === "" &&
    token.appType === undefined &&
    token.appType === null
  ) {
    return res.json({ msg: "Invalid appType", success: false });
  }
  if (token.personType === "SELLER") {
    Seller.findOne({ _id: token.personID })
      .then((foundSeller) => {
        if (foundSeller !== null) {
          if (token.appType === "WEB") {
            foundSeller.webFcToken = token.fcToken;
          } else if (token.appType === "MOBILE") {
            foundSeller.mobileFcToken = token.fcToken;
          }
          foundSeller
            .save()
            .then((tokenSaved) => {
              if (tokenSaved) {
                return res
                  .json({
                    msg: "Seller's Token Updated!",
                    tokenSaved,
                    success: true,
                  })
                  .status(200);
              } else {
                return res
                  .json({ msg: "Seller's Token Not Updated!", success: false })
                  .status(400);
              }
            })
            .catch((err) => {
              console.log(err);
              return res
                .json({ msg: "Find Failed!", success: false })
                .status(400);
            });
        } else {
          return res
            .json({ msg: "Seller Not Exist!", success: false })
            .state(404);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "Find Failed!", success: false }).status(400);
      });
  } else if (token.personType === "USER") {
    User.findOne({ _id: token.personID })
      .then((foundUser) => {
        if (foundUser !== null) {
          if (token.appType === "WEB") {
            foundUser.webFcToken = token.fcToken;
          } else if (token.appType === "MOBILE") {
            foundUser.mobileFcToken = token.fcToken;
          }

          foundUser.save().then((tokenSaved) => {
            if (tokenSaved) {
              return res
                .json({
                  msg: "User's Token Updated!",
                  tokenSaved: tokenSaved,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({ msg: "User's Token Not Saved!", success: false })
                .status(404);
            }
          });
        } else {
          return res.json({ msg: "Invalid Id!", success: false }).status(404);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "Find Failed!", success: false }).status(400);
      });
  } else if (token.personType === "ADMIN") {
    Admin.findOne({ _id: token.personID })
      .then((foundAdmin) => {
        if (foundAdmin !== null) {
          if (token.appType === "WEB") {
            foundAdmin.webFcToken = token.fcToken;
          } else if (token.appType === "MOBILE") {
            foundAdmin.mobileFcToken = token.fcToken;
          }

          foundAdmin.save().then((tokenSaved) => {
            if (tokenSaved) {
              return res
                .json({
                  msg: "Admin's Token Updated!",
                  tokenSaved: tokenSaved,
                  success: true,
                })
                .status(200);
            } else {
              return res
                .json({ msg: "Admin's Token Not Saved!", success: false })
                .status(404);
            }
          });
        } else {
          return res.json({ msg: "Invalid Id!", success: false }).status(404);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "Find Failed!", success: false }).status(400);
      });
  }
});
Router.post("/update-fcToken-partner", (req, res) => {
  let { token } = req.body;

  Partner.findOne({ _id: token.partnerID })
    .then((foundPartner) => {
      if (foundPartner !== null) {
        if (token.appType === "WEB") {
          foundPartner.webFcToken = token.fcToken;
        } else if (token.appType === "MOBILE") {
          foundPartner.mobileFcToken = token.fcToken;
        }
        foundPartner
          .save()
          .then((tokenSaved) => {
            if (tokenSaved) {
              return res
                .json({ msg: "Partner's Token Updated!", success: true })
                .status(200);
            } else {
              return res
                .json({ msg: "Partner's Token Not Updated!", success: false })
                .status(400);
            }
          })
          .catch((err) => {
            console.log(err);
            return res
              .json({ msg: "Find Failed!", success: false })
              .status(400);
          });
      } else {
        return res
          .json({ msg: "Partner Not Exist!", success: false })
          .state(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "Find Failed!", success: false }).status(400);
    });
});

module.exports = Router;
