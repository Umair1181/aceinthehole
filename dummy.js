const express = require("express");
const app = express();

require("dotenv").config();
const bodyParser = require("body-parser");
const uuidv4 = require("uuid").v4;

app.use(bodyParser.urlencoded({ extended: true }));
const stripe = require("stripe")(process.env.secret_key, {
  apiVersion: "2020-03-02",
});
const { resolve } = require("path");

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// app.get("/", (req, res) => {
// const path = resolve("./client/index.html");
// res.sendFile(path);
// });

app.get("/connect", (req, res) => {
  const state = uuidv4();
  // req.session.state = state;
  const suggested_capabilities = ["card_payments", "transfers"];
  const stripe_user = [{ email: "test@gmail.com" }];
  const args = new URLSearchParams({ state, client_id: process.env.client_id });
  const url = `https://connect.stripe.com/express/oauth/authorize?${args.toString()}&suggested_capabilities[]=transfers&suggested_capabilities[]=card_payments`;
  res.send({ url, state });
});

app.post("/add-user-account", (req, res) => {
  stripe.accounts.create(
    {
      type: "custom",
      country: "US",
      email: "ali1234@gmail.com",
      requested_capabilities: ["card_payments", "transfers"],
    },
    (err, account) => {
      if (err) {
        console.log("Error in Creating Acount ....");
        return res.json({ msg: "Failed", success: false }).status(400);
      } else {
        console.log("Account is Created!");
        return res
          .json({ msg: "Account Creted", success: true, account })
          .status(200);
      }
    }
  );
});

app.post("/connect/oauth", async (req, res) => {
  console.log("oauth # 1");
  // return res.json ({ msg: "oath" });
  let { code, state } = req.body;

  // Assert the state matches the state you provided in the OAuth link (optional).
  // if(!stateMatches(state)) {
  // return res.status(403).json({ error: 'Incorrect state parameter: ' + state });
  // }

  // Send the authorization code to Stripe's API.

  stripe.oauth
    .token({
      grant_type: "authorization_code",
      code,
    })
    .then(
      (response) => {
        console.log("oauth # 2");

        let connected_account_id = response.stripe_user_id;
        saveAccountId(connected_account_id);
        // Render some HTML or redirect to a different page.
        return res
          .status(200)
          .json({ success: true, msg: "Connected Successfully!" });
      },
      (err) => {
        console.log("oauth # 3");

        if (err.type === "StripeInvalidGrantError") {
          console.log("oauth # 4");
          return res
            .status(400)
            .json({
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

////
const stateMatches = (state_parameter) => {
  // Load the same state value that you randomly generated for your OAuth link.
  const saved_state = "sv_53124";

  return saved_state == state_parameter;
};

const saveAccountId = (id) => {
  // Save the connected account ID from the response to your database.
  console.log("Connected account ID: " + id);
};
//////
app.post("/api/create-intent", async (req, res) => {
  console.log("api called");
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    // payment_method_types: ['card'],
    // amount,
    // currency: 'usd',
    // // application_fee_amount: 5,
    // transfer_data: {
    // destination: 'acct_1HD7onEpGBTVAwpl',
    // },
    payment_method_types: ["card"],
    amount,
    currency: "usd",
    // application_fee_amount: 123,
    // transfer_data: {
    // destination: 'card_1HEK0PLyRGi8tkbzhiDfBIuD',
    // },
  });

  return res
    .json({ client_secret: paymentIntent.client_secret, success: true })
    .status(200);
});

app.post("/transfer-to-account", async (req, res) => {
  const transfer = await stripe.transfers.create({
    amount: 500,
    currency: "usd",
    destination: "acct_1HEJpwLyRGi8tkbz",
  });
  return res.json({ transfer, success: true }).status(200);
});

app.post("/retrieve-stripe-connect-account", (req, res) => {
  const { userConnectId } = req.body;
  stripe.accounts
    .listCapabilities(userConnectId)
    // stripe.accounts.retrieve(userConnectId)
    .then((account) => {
      return res.json({ account });
    })
    .catch((err) => {
      return res.json({ msg: "User Catch Error", success: false }).status(400);
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`APP ON LISTENING IN PORT ${port}`);
});
