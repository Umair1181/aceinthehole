const Router = require("express").Router();
const { Chat, Seller, User } = require("../../MODELS");


Router.post( "/has-new-message" , ( req, res ) => {
  const { userId, isSeller } = req.body ;
  let findObject = "" ; 
  if( isSeller === true ){
    findObject = {
      seller: userId,
      sellerSeenStatus: false
      // userSeenStatus : false,
    };
  }else{
    findObject = {
      user: userId,
      userSeenStatus: false
    };
  }
  
  Chat.find( findObject
    // { 
    // $or: [
    //   { user: userId, isDeleted: false, friendSeenStatus: false },
    //   { friend: userId, isDeleted: false, userSeenStatus: false }
    // ],
  // } 
  )
  .select("sellerSeenStatus userSeenStatus")
  .then( chatsList => { 
      if( chatsList.length > 0 ){
        return res.json({ count : chatsList.length, msg: "New Messages", success: true }).status( 200 ) ;
      }else{
        return res.json({findObject, msg: "No New Message", success: false }).status( 500 );
      }
    }
   )
   .catch( err=> {
     return res.json({ msg: "Catch Error Checking newMessagews", success: false }).status( 500 );
   } )
})

Router.post( "/chat-readed", ( req, res ) => {
  const { chat }  = req.body;

  Chat.findOne({ _id: chat._id })
  
  .then( async foundChat => {
    // let fuser = await User.findOne({ _id: foundChat.user }).select( "_id userName" );
    // let fSeller  = await Seller.findOne({ _id: foundChat.seller }).select( "_id sellerName" );
    if( foundChat.user.toString() === chat.user.toString() ){
      console.log( "check 1" );

      foundChat.userSeenStatus = true;
    }
    if( foundChat.seller.toString() === chat.user.toString() ){
      console.log( "check 2" ); 
      foundChat.sellerSeenStatus = true;
    }
    let sChat = await foundChat.save();
    // fuser ,fSeller ,sChat ,
    return res.json({ msg: "Chat Updated For Seen status", success:true }).status( 200 );
  } )
  .catch( err=>  {
    return res.json({ msg: "Chat finding catch Error", success: false }).status( 500 );
  } )
} )


Router.post("/delete-all-chats", async (req, res) => {
  let allChats = await Chat.find();

  for (let index = 0; index < allChats.length; index++) {
    const element = allChats[index];

    let deleted = await Chat.deleteOne({ _id: element._id });
    if (allChats.length === index + 1) {
      return res.json({ msg: "Deleted", success: true });
    }
  }
});
Router.post("/enable-offers", (req, res) => {
  Chat.findOne({ _id: ID }).then();
});

Router.post("/send-offer", (req, res) => {
  const { data } = req.body;
  console.log("data");
  console.log(data);

  console.log("check 1");
  let seller = "";
  let user = "";
  if (data.isSeller === true) {
    seller = data.from;
    user = data.to;
  } else {
    seller = data.to;
    user = data.from;
  }

  Chat.findOne({ user: user, seller: seller })
    .then((foundPreviousChat) => {
      if (foundPreviousChat != null) {
        foundPreviousChat.msgOffer.push({
          myType: data.type,
          payload: data.payload,
          // offerStatus: data.offerStatus,
          from: seller,
          to: user,
          // randomId : data.randomId
        });
        foundPreviousChat.userSeenStatus = false;
        foundPreviousChat
          .save()
          .then((savedChat) => {
            if (savedChat !== null) {
              console.log("Message Sent and Saved");
              // @todo
              data.payload =
                savedChat.msgOffer[savedChat.msgOffer.length - 1].payload;
              data._id = savedChat.msgOffer[savedChat.msgOffer.length - 1]._id;
              console.log("data._id");
              data.offerStatus = true;
              data.myType = data.type;

              // console.log(data._id );
              console.log(data);
              global.gSocket.in(data.to).emit("onRecieve", { query: data });
              // global.gSocket.in(data.from).emit("onRecieve", { query: data });

              return res
                .json({
                  msg: "Message Sent and Saved",
                  data,
                  success: true,
                })
                .status(200);
            } else {
              console.log("Message Not Saved");
              return res
                .json({ msg: "Message Not Saved", success: false })
                .status(404);
            }
          })
          .catch((err) => {
            console.log(err);
            console.log("catch error: newChat.save ");
            return res
              .json({ msg: "catch error: newChat.save ", success: false })
              .status(400);
          });
      } else {
        console.log("chat not found!");
        let newChat = new Chat({
          msgOffer: {
            myType: data.type,
            payload: data.payload,
            from: seller,
            to: user,
          },
          user: user,
          seller: seller,
        });
        newChat
          .save()
          .then((savedChat) => {
            if (savedChat) {
              // @todo
              data.payload = savedChat.payload;
              data._id = savedChat.msgOffer._id;
              console.log("data._id");

              console.log(savedChat);
              global.gSocket.in(data.to).emit("onRecieve", { query: data });

              console.log("Message Sent and Saved");
              return res
                .json({
                  msg: "Message Sent and Saved",
                  data: savedChat,
                  success: true,
                })
                .status(200);
            } else {
              console.log("Message Not Saved");
              return res
                .json({ msg: "Message Not Saved", success: false })
                .status(404);
            }
          })
          .catch((err) => {
            console.log(err);
            console.log("Failed Catch Error!");
            return res
              .json({ msg: "Failed Catch Error!", success: false })
              .status(500);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("Find User Seller catch error 1");
      return res
        .json({ msg: "Find User Seller catch error 1", success: false })
        .status(500);
    });
});

Router.post("/accept-offer", (req, res) => {
  let { data } = req.body;
  let message = false;
  if (data === "") {
    message = "Invalid Offer data!";
  } else if (data.to === "") {
    message = "Invalid User ID!";
  } else if (data.from === "") {
    message = "Invalid Seller ID!";
  } else {
    message = false;
  }
  if (message === false) {
    Chat.findOne({
      user: data.to,
      seller: data.from,
      // msgOffer: { $in: [{ _id: data._id }] }
    })
      .then((fChat) => {
        let index = fChat.msgOffer.findIndex((m) => m._id == data._id);

        if (index >= 0) {
          console.log("object offer");
          console.log(fChat.msgOffer[index].offerStatus);
          if (fChat.msgOffer[index].offerStatus === false) {
            console.log("Offer Dsimissed!");
            data.offerStatus = false;
            // global.gSocket.in(data.to).emit("onAcceptOffer", { query: data });
            global.gSocket.in(data.from).emit("onAcceptOffer", { query: data });
            return res
              .json({ msg: "Offer Already Accepted!", success: false })
              .status(400);
          } else {
            fChat.msgOffer[index].offerStatus = false;
            fChat
              .save()
              .then((sChat) => {
                console.log("SAVED CHAT HERE.");
                console.log(sChat.msgOffer[index].offerStatus);
                console.log("Offer Accepted");
                data.offerStatus = false;
                data.myType = data.type;
                global.gSocket
                  .in(data.from)
                  .emit("onAcceptOffer", { query: data });
                // global.gSocket.in(data.to).emit("onAcceptOffer", { query: data });
                return res
                  .json({ msg: "Offer Accepted!", data, success: true })
                  .status(200);

                // add to cart
                // import cart modal above
                // find user cart with this seller
                // push cart in that arrayof products
                // else create new cart of this seller and user with this product
              })
              .catch((err) => {
                console.log("SAVING ERROR");
                console.log(err);
                return res
                  .json({
                    msg: "Offer Accept Failed! 'SAVING ERROR'",
                    data: data,
                    success: false,
                  })
                  .status(400);
              });
          }
        } else {
          console.log("not found CHAT HERE.");
          console.log(index);
          return res
            .json({
              msg: "Offer Accept Failed! 'SAVING ERROR'",
              data: data,
              success: false,
            })
            .status(400);
        }
      })
      .catch((err) => {
        console.log("Chat Find Catch error");
        return res
          .json({
            msg: "Offer Accept Failed! 'Chat Find Catch error'",
            data: data,
            success: false,
          })
          .status(400);
      });
  } else {
    return res.json({ msg: message, success: false }).status(500);
  }
});



//////////////////////all-chats-of-user/////////////////////////
Router.post("/all-chats-of-user", (req, res) => {
  let { chat } = req.body;
  Chat.find({ user: chat.user })
    .populate({ path: "seller" })
    .then((foundChat) => {
      if (foundChat.length > 0) {
        let AllSellers = [];
        for (let index = 0; index < foundChat.length; index++) {
          const element = foundChat[index].seller;

          // , seenStatus: foundChat[index].sellerSeenStatus }
          


          AllSellers.push( {
            _id: element._id,
            isOnline: element.isOnline,
            sellerName: element.sellerName, 
            profileImgURL: element.profileImgURL, 
            seenStatus: foundChat[index].userSeenStatus,
          } );
          if (index + 1 == foundChat.length) {
            return res
              .json({
                msg: "Chat Sellers!",
                Sellers: AllSellers,
                success: true,
              })
              .status(200);
          }
        }
      } else {
        return res.json({ msg: "No Chat Exist!", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "catch error", success: false }).status(500);
    });
});
//////////////////////all-chats-of-seller/////////////////////////
Router.post("/all-chats-of-seller", (req, res) => {
  let { chat } = req.body;
  Chat.find({ seller: chat.seller })
    .populate({
      path: "user",
    })
    .then((foundChat) => {
      if (foundChat.length > 0) {
        let AllUsers = [];

        for (let index = 0; index < foundChat.length; index++) {
          const element = foundChat[index].user;
          AllUsers.push({
            _id: element._id,
            isOnline: element.isOnline,
            userName: element.userName, 
            profileImgURL: element.profileImgURL, 
            seenStatus: foundChat[index].sellerSeenStatus,
          });
          if (index + 1 == foundChat.length) {
            return res
              .json({
                msg: "Chat Users!",
                Sellers: AllUsers,
                success: true,
              })
              .status(200);
          }
        }
      } else {
        return res.json({ msg: "No Chat Exist!", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "catch error", success: false }).status(500);
    });
});
//////////////////////chat-of-sender-and-receiver/////////////////////////
Router.post("/chat-of-sender-and-receiver", (req, res) => {
  let { chat } = req.body;
  let message = false;
  if( chat.offset === "" || chat.offset === undefined ){
    message = "Invalid Offset Value";
  }else if ( chat.limit  === ""  || chat.limit === undefined ) {
    message = "Invalid Limit Value";
  }else if( chat.user === "" || chat.user === undefined ){
    message = "Invalid Use Id";
  }else if( chat.seller === "" || chat.seller === undefined ){
    message = "Invalid Seller Id";
  }else  {
    message = false;
  }

  if( message === false ){
    Chat.findOne({ user: chat.user, seller: chat.seller })
    .then((foundChat) => {
      if (foundChat !== null) {
        // 
        let myChat = foundChat.msgOffer.reverse();
        myChat = myChat.slice(chat.offset, chat.offset + chat.limit);
        myChat = myChat.reverse();

        return res
          .json({
            msg: "Chat of Sender & Receiver",
            chatLength: myChat.length,
            messages: myChat,
            chatId: foundChat._id,
            success: true,
          })
          .status(200);
      } else {
        return res.json({ msg: "No Chat Exist", success: false }).status(404);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "catch error", success: false }).status(500);
    });
  }else{
    return res.json({ msg: message , success: false }).status( 500 );
  }

});


Router.post("/remove-all-chat", (req, res) => {
  Chat.remove()
    .then((r) => {
      return res.json({ msg: "Chat Removed!", success: true }).status(200);
    })
    .catch((err) => {
      return res.json({ msg: "Fialaed!", success: false }).status(400);
    });
});
module.exports = Router;
