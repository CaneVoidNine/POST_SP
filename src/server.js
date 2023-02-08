import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { pgConnect, syncModels } from "./db.js";
import {
  badRequestErrorHandler,
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js";
import productRouter from "./api/products/index.js";
import usersRouter from "./api/users/index.js";
import cartRouter from "./api/cart/index.js";
import reviewsRouter from "./api/reviews/index.js";
import categoryRouter from "./api/categories/index.js";

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/products", productRouter);
server.use("/users", usersRouter);
server.use("/cart", cartRouter);
server.use("/reviews", reviewsRouter);
server.use("/categories", categoryRouter);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(genericErrorHandler);

await pgConnect();
await syncModels();

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
