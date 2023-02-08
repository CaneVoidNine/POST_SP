import express from "express";
import CategoriesModel from "./model.js";
import createHttpError from "http-errors";

const categoryRouter = express.Router();

categoryRouter.post("/", async (req, res, next) => {
  try {
    const { categoryId } = await CategoriesModel.create(req.body);
    res.status(201).send({ categoryId });
  } catch (error) {
    next(error);
  }
});

categoryRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll();
    res.send(categories);
  } catch (error) {
    next(error);
  }
});
categoryRouter.get("/:categoryId", async (req, res, next) => {
  try {
    const category = await CategoriesModel.findByPk(req.params.categoryId);
    if (category) {
      res.send(category);
    } else {
      createHttpError(
        404,
        `Category with id ${req.params.categoryId}not found!`
      );
    }
  } catch (error) {
    next(error);
  }
});
categoryRouter.put("/:categoryId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await CategoriesModel.update(
      req.body,
      {
        where: { id: req.params.categoryId },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords);
    } else {
      next(
        createHttpError(
          404,
          `Category with id ${req.params.categoryId}not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

categoryRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await CategoriesModel.destroy({
      where: { id: req.params.categoryId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Category with id ${req.params.categoryId}not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default categoryRouter;
