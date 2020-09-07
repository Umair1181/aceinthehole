// const xoauth2 = require("xoauth2");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
// const { upload, CreateURL } = require("./storage")();

/////////////////////BODY-PARSER CONFIGURATION /////////////////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//////Stripe config//////////
const stripe = require("stripe")(process.env.secret_key, {
  apiVersion: "2020-03-02",
});
//////Serve////////////////////////////////////////////////////////////
const socket = require("socket.io");
const {
  setOnlineStatusUser,
  setOnlineStatusSeller,
  saveToDbChat,
  saveOfferToDbChat,
  acceptOffer,
} = require("./API/CHAT/userChat");
const { Seller, Order } = require("./MODELS");
///////////////FRONT END ERROR RESOLVED CODE /////////////////////
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
///////////////////DATABASE  CONFIGURATION/////////////////////
const db = require("./CONFIG/dbConfig").mongodbOnline;
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((m) => {
    global.mongodbconndbs = m.connection;
    ///////////////// API ROUTES ////////////////
    app.use("/chat", require("./ROUTES/chatRoutes"));
    app.use("/admin", require("./ROUTES/adminRoutes"));
    app.use("/seller", require("./ROUTES/sellerRoutes"));
    app.use("/order", require("./ROUTES/orderRoutes"));
    app.use("/user", require("./ROUTES/userRoutes"));
    app.use("/service", require("./ROUTES/sellerRoutes"));
    app.use("/notifications", require("./ROUTES/notificationsRoutes"));
    app.use("/files", require("./API/FIES/imageAPI"));
    app.get("/", (req, res) => {
      res.json({ msg: "server running..." }).status(200);
    });
    console.log(`DATABASE CONNEDCTED`);
  })
  .catch((err) => {
    console.log("db connect catch error");
    console.log(err);
    // return res.json({ msg: "db catch error" }).status(400);
  });

////////////STRIPE APIs///////////////
app.post("/connect", (req, res) => {
  let { sellerID } = req.body;
  if (sellerID === "") {
    return res.json({ msg: "Invalid Seller ID", success: false }).status(505);
  }
  const state = sellerID;
  // req.session.state = state;
  const suggested_capabilities = ["card_payments", "transfers"];
  const stripe_user = [{ email: "test@gmail.com" }];
  const args = new URLSearchParams({ state, client_id: process.env.client_id });
  const url = `https://connect.stripe.com/express/oauth/authorize?${args.toString()}&suggested_capabilities[]=transfers&suggested_capabilities[]=card_payments`;
  res.send({ url, state });
});

app.post("/connect/oauth", async (req, res) => {
  console.log("oauth # 1");
  // return res.json ({ msg: "oath" });
  let { code, state } = req.body;
  // sellerId = state
  // Send the authorization code to Stripe's API.
  stripe.oauth
    .token({
      grant_type: "authorization_code",
      code,
    })
    .then(
      (response) => {
        console.log("oauth # 2");
        // response.stripe_user_id seller stripe connect account id

        let connected_account_id = response.stripe_user_id;
        saveAccountId(connected_account_id, state)
          .then((result) => {
            return res.json(result).status(200);
          })
          .catch((err) => {
            return res.json(err).status(500);
          });
        // Render some HTML or redirect to a different page.
      },
      (err) => {
        console.log("oauth # 3");

        if (err.type === "StripeInvalidGrantError") {
          console.log("oauth # 4");
          return res.status(400).json({
            success: false,
            msg: "Invalid authorization code: " + code,
          });
        } else {
          console.log("oauth # 5");
          return res
            .status(500)
            .json({ success: false, msg: "An unknown error occurred." });
        }
      }
    );
});

const saveAccountId = (stripeId, sellerID) => {
  return new Promise((resolve, reject) => {
    Seller.updateOne({ _id: sellerID }, { stripeAccountId: stripeId })
      .then((response) => {
        if (response !== null) {
          resolve({
            msg: "Seller Account Connected",
            seller: response,
            success: true,
          });
        } else {
          reject({ error: { msg: "Seller Id Update Failed" }, success: false });
        }
      })
      .catch((err) => {
        console.log("Catch Error In Seller Update");
        console.log(err);
        reject({
          error: { msg: "Catch, Faild, Seller Update" },
          success: false,
        });
      });
  });
  // Save the connected account ID from the response to your database.
  console.log("Connected account ID: " + id);
};

app.post("/api/create-intent", async (req, res) => {
  console.log("api called");
  const { amount } = req.body;
  stripe.paymentIntents.create(
    {
      // payment_method_types: ['card'],
      // amount,
      // currency: 'usd',
      // // application_fee_amount: 5,
      // transfer_data: {
      //   destination: 'acct_1HD7onEpGBTVAwpl',
      // },
      payment_method_types: ["card"],
      amount: amount * 100,
      currency: "usd",
      // application_fee_amount: 123,
      // transfer_data: {
      //     destination: 'card_1HEK0PLyRGi8tkbzhiDfBIuD',
      // },
    },
    (err, paymentIntent) => {
      if (paymentIntent) {
        return res
          .json({
            paymentIntent,
            client_secret: paymentIntent.client_secret,
            intentId: paymentIntent.id,
            success: true,
          })
          .status(200);
      } else {
        return res
          .json({ err: err.type, msg: "Payment Intent Failed", success: false })
          .status(400);
      }
    }
  );
});
app.post("/transfer-to-account", async (req, res) => {
  const { sellerConnectAccountId, sellerId, orderId, amount } = req.body;

  if (sellerConnectAccountId === "") {
    return res
      .json({ msg: "Invalid sellerConnectAccountId", success: false })
      .status(500);
  }
  if (sellerId === "") {
    return res.json({ msg: "Invalid sellerId", success: false }).status(500);
  }
  if (amount === "") {
    return res.json({ msg: "Invalid amount", success: false }).status(500);
  }
  Seller.findOne({ _id: sellerId })
    .then(async (foundSeller) => {
      if (foundSeller !== null) {
        const transfer = await stripe.transfers.create({
          amount: amount * 100,
          currency: "usd",
          destination: sellerConnectAccountId,
        });
        if (transfer.object === "transfer") {
          // todo Make Order PAID

          Order.updateOne({ _id: orderId }, { isPaid: true }).then(
            (response) => {
              if (response !== null) {
                return res
                  .json({
                    msg: "Transfer Succesfully Made",
                    transfer,
                    success: true,
                  })
                  .status(200);
              } else {
                return res.json({ msg: "Failed", success: false }).status(500);
              }
            }
          );
        } else {
          return res.json({ msg: "Transection Failed", success: false });
        }
      } else {
        return res
          .json({ msg: "Seller Not Found", success: false })
          .status(500);
      }
    })
    .catch((err) => {
      return res
        .json({
          err: err.type,
          msg: "Catch, Error,Seller Found",
          success: false,
        })
        .status(500);
    });
});
////// past as it is
app.post("/refund-stripe-payment", (req, res) => {
  const { amount, intentId, orderId } = req.body;

  stripe.refunds.create(
    {
      amount: amount * 100,
      payment_intent: intentId,
    },
    (err, refund) => {
      // return res.json({ refund });
      if (err) {
        return res.json({ msg: err.raw.message, success: false }).status(500);
      } else {
        if (refund.status === "succeeded") {
          Order.updateOne(
            { _id: orderId },
            { orderStatus: "ORDERCANCELED" }
          ).then((updateOrder) => {
            if (updateOrder !== null) {
              return res
                .json({ msg: "Payment Refunded", success: true })
                .status(500);
            }
          });
        } else {
          return res
            .json({ msg: "Refunding Failed", success: false })
            .status(400);
        }
      }
    }
  );
});
///////////// PORT ENVOIRMENT //////////////////
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`SERVER RUNNING AT PORT ${port}`);
});

///// chat with socket

const io = socket(server);
io.on("connection", async (socket) => {
  global.gSocket = socket;
  const query = socket.handshake.query;
  let isSeller = query.isSeller;
  console.log(`${isSeller ? "Seller" : "user"} is connected: ${query}`);
  if (socket.adapter.rooms[query.uid]) {
    console.log("leave - join");
    await socket.leave(query.uid);
    await socket.join(query.uid);
  } else {
    console.log("---- join");
    await socket.join(query.uid);
  }

  // status online to query.uid;
  if (isSeller == true) {
    setOnlineStatusSeller(query.uid, true);
  } else {
    setOnlineStatusUser(query.uid, true);
  }

  // // responce to user for accepting
  // socket.on("offerResponseToUser", res => {
  //   console.log();
  //   const query = res.query;
  //   socket.in(query.to).emit("offerResponseToUser", { query: query });
  // });

  // socket.on("onAcceptOffer", res => {
  //   //sending to Seller Confirmation of offer acceptence
  //   const query = res.query;
  //   // acceptOffer(query, socket);

  //   ///// manually status modify : query
  //   // query.offerStatus = false;
  //   socket.in(query.from).emit("offerResponseToUser", { query: query });
  // });

  socket.on("onSend", async (res) => {
    const query = res.query;
    console.log("onSend");
    if (query.type == "OFFER") {
      console.log(" went for offer offer");
      await saveOfferToDbChat(query, socket);
      // socket.in(query.to).emit("onRecieve", { query: query });
    } else {
      console.log("Message");
      console.log(query);
      await saveToDbChat(query);
      socket.in(query.to).emit("onRecieve", { query: query });
    }
  });

  socket.on("disconnect", (res) => {
    console.log(`user with id:${query.uid} is Disconnected`);
    /// update status offline to query.uid;
    console.log(`${query.isSeller ? "seller" : "user"}` + " is Dis-Connected");
    let isSeller = query.isSeller;
    if (isSeller == true) {
      setOnlineStatusSeller(query.uid, false);
    } else {
      setOnlineStatusUser(query.uid, false);
    }
    socket.leave(query.uid);
  });
});
app.post("/retrieve-stripe-connect-account", (req, res) => {
  const { userConnectId } = req.body;
  stripe.accounts
    .listCapabilities(userConnectId)
    // stripe.accounts.retrieve(userConnectId)
    .then((account) => {
      return res.json({
        account,
      });
    })
    .catch((err) => {
      return res
        .json({
          msg: "User Catch Error",
          success: false,
        })
        .status(400);
    });
});
// app.post("/upload", upload.array("image", 1), (req, res) => {
//   let imageArrays = req.files;
//   let ImageURLsArray = [];
//   imageArrays.forEach((eachFoundPic) => {
//     ImageURLsArray.push(`/files/images/${eachFoundPic.filename}`);
//   });

//   if (ImageURLsArray.length > 0) {
//     return res
//       .json({
//         msg: "Imgae Uploaded!",
//         imgurl: ImageURLsArray[0],
//         success: true,
//       })
//       .status(400);
//   } else {
//     return res.json({ msg: "Failed!", success: false }).status(400);
//   }
// });
