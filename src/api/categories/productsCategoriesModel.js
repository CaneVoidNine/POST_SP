import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import ProductsModel from "../products/model.js";
import CategoriesModel from "./model.js";

const ProductsCategoriesModel = sequelize.define("productCategory", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

ProductsModel.belongsToMany(CategoriesModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false },
});
CategoriesModel.belongsToMany(ProductsModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "categoryId", allowNull: false },
});

export default ProductsCategoriesModel;
