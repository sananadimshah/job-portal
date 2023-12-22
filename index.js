import express from "express";
import "express-async-errors";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import route from "./routes/route.js";
import cors from "cors";
import morgan from "morgan";
import errMiddleware from "./middlewares/errorMiddleware.js";
//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

mongoose
  .connect(`${process.env.MONGO_URL}`, {})

  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

app.use("/", route);
// validation middleware
app.use(errMiddleware)
const PORT = process.env.PORT || PORT;

app.listen(PORT, () => {
  console.log(
    `server running is on ${process.env.DEV_MODE} on port no ${PORT}`
  );
});
