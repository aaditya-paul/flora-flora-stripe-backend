import express from "express";
import Stripe from "stripe";
import { env } from "process";

const app = express();
const port = process.env.PORT || 3000; //add your port here
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

//Confirm the API version from your stripe dashboard
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" });

app.listen(port, () => {
  console.log(
    `Example app listening at ${port}`
  );
});

app.use(express.json());
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.send("HELLO DEAR !!");
});

app.post("/create-payment-intent", async function(request, response) {
  console.log("working !");
  const amount = request.body.user.amount;
  const name = request.body.user.name;
  const address = request.body.user.address;
  const pincode = request.body.user.pincode;
  const quantity = request.body.user.quantity;
  const phone = request.body.user.phone;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * quantity, //lowest denomination of particular currency
      currency: "inr",
      payment_method_types: ["card"], //by default,
      description: "Medicine selling services", // to be changed
      shipping: {
        name: name,
        phone: phone,
        address: {
          line1: address,
          postal_code: pincode,
          country: "INDIA"
        }
      }
    });

    const clientSecret = paymentIntent.client_secret;

    response.json({
      clientSecret: clientSecret
    });
  } catch (e) {
    console.log(e.message);
    response.json({ error: e.message });
  }
  response.end();
});
