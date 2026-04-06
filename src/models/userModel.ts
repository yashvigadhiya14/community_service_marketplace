import { DataTypes, Model } from "sequelize"
import type { Optional } from "sequelize"
import sequelize from "../config/db.js"
import type { UserAttributes } from "../interfaces/user_interface.js"

interface UserCreationAttributes
  extends Optional<
    UserAttributes, "user_id" | "is_verified" | "phone" | "refresh_token" | "reset_password_token" | "reset_password_expiry"
  > { }
class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {

  public user_id!: number
  public username!: string
  public email!: string
  public password!: string
  public role!: "Admin" | "Service Provider" | "Customer"

  public phone!: string | null
  public is_verified!: boolean
  public verification_token!: string | null
  public verification_token_expiry!: Date | null
  public refresh_token!: string | null

  public reset_password_token!: string | null
  public reset_password_expiry!: Date | null


  public created_at!: Date
  public updated_at!: Date
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM("Admin", "Service Provider", "Customer"),
      allowNull: false
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    verification_token: {
      type: DataTypes.STRING,
      allowNull: true
    },

    verification_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true

    },
    reset_password_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    }

  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  })

export default User