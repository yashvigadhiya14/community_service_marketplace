import { DataTypes,Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize  from "../config/db.js";
import type { ServiceAttributes } from "../interfaces/service_interface.js";
import Booking from "./bookingModel.js";





interface ServiceCreationAttributes extends Optional<ServiceAttributes, "service_id" | "status">{}

class Service extends Model<ServiceAttributes,ServiceCreationAttributes>
implements ServiceAttributes{
  public service_id!:number
  public provider_id!: number
  public category_id!: number
  public title!: string
  public service_description!: string
  public price!: number
  public location!: string
  public availability!: string
  public city!: string
  public status!: "active" | "inactive"
}

Service.init({
  service_id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
  },

  provider_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },
  category_id:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  title:{
    type:DataTypes.STRING,
    allowNull:false
  },
  service_description:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  price:{
    type:DataTypes.DECIMAL,
    allowNull:false
  },
  location:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  availability:{
    type:DataTypes.TEXT,
  },
  city:{
    type:DataTypes.STRING,
  },
  status:{
    type:DataTypes.ENUM("active","inactive"),
    defaultValue:"active",
  },

},
{
  sequelize,
  modelName:"Service",
  tableName:"services",
  paranoid:true,
  timestamps:true
}
);





export default Service