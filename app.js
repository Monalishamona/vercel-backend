const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
require("./conn/conn");

const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
app.use(cors({
    origin: "https://vercel-frontend-iota-eosin.vercel.app", // Your Vite frontend URL
    credentials: true,
  }));
app.use(express.json());
//routes
app.get("/", (req, res) => {
  res.send("API is working");
});


app.use("/api/v1", User);
app.use("/api/v1",Books);
app.use("/api/v1",Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1",Order);
//creating port
app.listen(process.env.PORT , ()=>{
    console.log(`Serve statrted ${process.env.PORT}`);
});
