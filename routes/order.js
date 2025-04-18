const router = require('express').Router();
const { authenticateToken } = require('./userAuth');
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

router.post("/place-order", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const { order } = req.body;
  
      const orderIds = [];
      const bookIds = [];
  
      for (const item of order) {
        const newOrder = new Order({ user: id, book: item._id });
        const savedOrder = await newOrder.save();
        orderIds.push(savedOrder._id);
        bookIds.push(item._id);
      }
  
      // Single update to user: push orders and clear cart
      await User.findByIdAndUpdate(
        id,
        {
          $push: { orders: { $each: orderIds } },
          $pull: { cart: { $in: bookIds } },
        },
        { new: true }
      );
  
      return res.json({
        status: "Success",
        message: "Order Placed Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  });
  
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers; // Ensure this is coming from the correct source
        // Log the user ID
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });

        

        const ordersData = userData.orders.reverse();
        return res.json({
            status: "Success",
            data: ordersData,
        });
    } catch (error) {
        console.log("Error fetching order history:", error); // Log the full error details
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

router.get("/get-all-order",authenticateToken, async (req,res)=>{
    try{
        
        const orders = await Order.find()
  .populate("user")
  .populate("book")
  .sort({ createdAt: -1 });

return res.json({
  status: "Success",
  data: orders,
});

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
    }
});

//update order admin
router.put("/update-status/:id", authenticateToken , async (req,res)=>{
    try{
        const {id} = req.params;
        await Order.findByIdAndUpdate(id,{status: req.body.status});
        return res.json({
            status:"Success",
            message:"Status Updated successfully",
        });
    }catch{
        console.log(error);
        return res.status(500).json({message: "An error occured"});
    }
});
module.exports = router;