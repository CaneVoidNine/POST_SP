import sequelize from "../../db.js";
import { DataTypes } from "sequelize";

const CartModel = sequelize.define("cart", {
  cartId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
});

export default CartModel;
