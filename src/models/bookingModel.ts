import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../config/db.js";
import type { BookingAttributes } from "../interfaces/bookingInterface.js";
import Service from "./serviceModel.js"




interface BookingCreationAttributes
  extends Optional<
    BookingAttributes,
    "booking_id" | "booking_status" | "created_at" | "updated_at" | "deleted_at"
  > {}

class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  public booking_id!: number;
  public service_id!: number;
  public customer_id!: number;

  public booking_date!: string;
  public booking_time!: string;

  public booking_status!:"pending" | "confirmed" | "completed" | "cancelled";

  public billing_name!: string;
  public billing_email!: string;
  public billing_phone!: string;
  public billing_address!: string;

  public total_amount!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Booking.init(
  {
    booking_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    booking_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    booking_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

     booking_status:{
        type:DataTypes.ENUM("pending","confirmed","completed","cancelled"),
        defaultValue:"pending",
      },

    billing_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    billing_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    billing_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    billing_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    total_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
    },

    updated_at: {
      type: DataTypes.DATE,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "bookings",
    timestamps: true,

    createdAt: "created_at",
    updatedAt: "updated_at",

    paranoid: true,
    deletedAt: "deleted_at",
  }
);



export default Booking;