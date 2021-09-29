import express from "express";
import Stripe from "stripe";
import { env } from "process";

const app = express();
const port = 5000; //add your port here
const PUBLISHABLE_KEY =
  "pk_test_51Jc9a2SGPn2j9bkhJ8ZFMU1blmCR7DK37Rc6DFOnpjAjiHtR0cyOmSCHFA50Ti3Pd6xhkDmUG9no3yU9er9z3li000fY24X11s";
const SECRET_KEY =
  "sk_test_51Jc9a2SGPn2j9bkhgS1F2gXcWnN7vmYUrzj6P5wJY9QpcPFNHiPZh4tdIJ1eJBeHkYJuWE6tWRDjuyzWppQSKYbO00TFC6Mxqg";

//Confirm the API version from your stripe dashboard
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" });

app.listen(port, () => {
  console.log(
    `Example app listening at 34.125.172.47:${port}/`
  );
});

app.use(express.json());

app.post("/create-payment-intent", async function (request, response) {
  console.log("working !");
  console.log(process.env);
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
          country: "INDIA",
        },
      },
    });

    const clientSecret = paymentIntent.client_secret;

    response.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.log(e.message);
    response.json({ error: e.message });
  }
  response.end();
});
