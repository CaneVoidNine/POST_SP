import express from "express";
import ProductsModel from "./model.js";
import { Op } from "sequelize";
import createHttpError from "http-errors";
import ReviewsModel from "../reviews/model.js";
import UsersModel from "../users/model.js";
import ProductsCategoriesModel from "../categories/productsCategoriesModel.js";

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductsModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.findAll({
      attributes: ["name", "price", "id"],
      include: [
        {
          model: ReviewsModel,
          include: [{ model: UsersModel, attributes: ["name", "surname"] }],
          attributes: ["content"],
        },
      ],
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      attributes: { exclude: ["createdAt"] },
      include: [
        {
          model: ReviewsModel,
          include: [{ model: UsersModel, attributes: ["name", "surname"] }],
          attributes: ["content", "reviewId"],
        },
      ],
    });
    if (product) {
      res.send(product);
      console.log(product.reviews);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(
      req.body,
      {
        where: { id: req.params.productId },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({
      where: { id: req.params.productId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId}not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productRouter;
