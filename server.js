const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const { upload, CreateURL } = require("./storage")();

/////////////////////BODY-PARSER CONFIGURATION /////////////////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//////Serve////////////////////////////////////////////////////////////
const socket = require("socket.io");
const {
  setOnlineStatusUser,
  setOnlineStatusSeller,
  saveToDbChat,
  saveOfferToDbChat,
  acceptOffer
} = require("./API/CHAT/userChat");
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
    app.use("/chat", require("./ROUTES/chatRoutes") );
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
///////////// PORT ENVOIRMENT //////////////////
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`SERVER RUNNING AT PORT ${port}`);
});

///// chat with socket

const io = socket(server);
io.on("connection", async socket => {
  global.gSocket = socket;
  const query = socket.handshake.query;
  let isSeller = query.isSeller;
  console.log(`${isSeller ? "Seller" : "user"} is connected: ${query}`);
  if (socket.adapter.rooms[query.uid]) {
    console.log("leave - join");
    await socket.leave(query.uid);
    await socket.join(query.uid);
  } else {
    console.log( "---- join" );
    await socket.join(query.uid);
  }

  // status online to query.uid;
  if(isSeller == true){
     setOnlineStatusSeller(query.uid, true)
  }else{
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

  socket.on("onSend",async res => {
    const query = res.query;
    console.log( "onSend" );
    if (query.type == "OFFER") {
      console.log( ' went for offer offer' );
      await saveOfferToDbChat(query, socket);
      // socket.in(query.to).emit("onRecieve", { query: query });
      
    } else {
      console.log("Message");
      console.log( query );
      await saveToDbChat(query);
      socket.in(query.to).emit("onRecieve", { query: query });

    }
  });

  socket.on("disconnect", res => {
    console.log(`user with id:${query.uid} is Disconnected`);
    /// update status offline to query.uid;
    console.log(`${query.isSeller ? "seller" : "user"}` + " is Dis-Connected");
    let isSeller = query.isSeller;
    if(isSeller == true){
      setOnlineStatusSeller(query.uid, false);
   }else{
      setOnlineStatusUser(query.uid, false);
   }
    socket.leave(query.uid);
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
