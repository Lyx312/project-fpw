import mongoose from "mongoose";
import User from "@/models/userModel"; 
import Post from "@/models/postModel";
import Category from "@/models/categoryModel";
import Country from "@/models/countryModel";
import Post_review from "@/models/post_reviewModel";
import Chat from "@/models/chatModel";
import User_trans from "@/models/user_transModel";
import Notification from "@/models/notificationModel";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("Mongo URI is not defined");
    process.exit(1);
  }

  if (mongoose.connection.readyState) {
    console.log("MongoDB is already connected");
    return true;
  }

  try {
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Register models
    mongoose.model('User', User.schema);
    mongoose.model('Post', Post.schema);
    mongoose.model('Category', Category.schema);
    mongoose.model('Country', Country.schema);
    mongoose.model('Post_review', Post_review.schema);
    mongoose.model('Chat', Chat.schema);
    mongoose.model('User_trans', User_trans.schema);
    mongoose.model('Notification', Notification.schema);

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1);
  }
};

export default connectDB;
