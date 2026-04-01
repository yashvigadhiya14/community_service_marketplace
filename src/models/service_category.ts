import { DataTypes,Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../config/db.js";
import type { ServiceCategoryAttributes } from "../interfaces/service_category_interface.js";

interface ServiceCategoryCreationAttributes extends Optional<ServiceCategoryAttributes,"service_category_id" | "description" | "status" | "deleted_at">{}


class ServiceCategory extends Model<ServiceCategoryAttributes,ServiceCategoryCreationAttributes> implements ServiceCategoryAttributes{
   public service_category_id!:number;
   public service_category_name!:string;
   public description!: string;
   public status!:"active" | "inactive";

   public created_at!:Date
   public updated_at!:Date
   public deleted_at!:Date
}

ServiceCategory.init(
  {
    service_category_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },

    service_category_name:{
      type:DataTypes.STRING,
      allowNull:false,
    },

    description:{
      type:DataTypes.TEXT,
      allowNull:true,
    },
    status:{
      type:DataTypes.ENUM("active","inactive"),
      defaultValue:"active",
    },

    deleted_at:{
      type:DataTypes.DATE,
      allowNull:true,
    },

  },
  {
    sequelize,
    tableName:"service_categories",
    timestamps:true,
    paranoid:true,
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
  }
);

export default ServiceCategory;