import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: "mysql",
    logging: false
  }
)

export const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("database connected sucessfully");
      break;
    }
    catch (error) {
      console.error(`db connection failed.Retries left:${retries}`);
      retries--;

      if (retries === 0) {
        console.error("All retry attempts failed");
        process.exit(1);
      }

      await new Promise((res) => setTimeout(res, 5000));


    }
  }
}

export default sequelize