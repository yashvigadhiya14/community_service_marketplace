import type { Request, Response } from "express"
import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";
import Booking from "../models/bookingModel.js"

export const getAdminDashboard = async (req: Request, res: Response) => {

  try {
    const [totalusers, totalproviders, totalservices, totalbookings, completedservices] = await Promise.all([
      User.count({ where: { role: "customer" } }),
      User.count({ where: { role: "provider" } }),
      Service.count(),
      Booking.count(),
      Booking.count({ where: { booking_status: "completed" } })
    ]);


    return res.status(200).json({
      success: true,
      data: {
        totalusers,
        totalproviders,
        totalservices,
        totalbookings,
        completedservices
      }
    });


  }
  catch (error) {
    console.log("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "something went wrong"
    })
  }
}