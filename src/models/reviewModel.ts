import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Review = sequelize.define("reviews", {
  review_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: "unique_review"
  },

  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: "unique_review"
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  timestamps: true
})

export default Review;