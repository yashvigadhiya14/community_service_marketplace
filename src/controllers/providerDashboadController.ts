import type { Request, Response } from "express";
import Service from "../models/serviceModel.js";
import Booking from "../models/bookingModel.js";
import { Op, fn, col } from "sequelize";


export const getProviderDashboard = async (req: any, res: Response) => {
  try {
    const providerid = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const [totalServices, totalBookings, completedBookings, upcomingbookings, earningResults] = await Promise.all([

      Service.count({
        where: { provider_id: providerid }
      }),

      Booking.count({
        include: [{
          model: Service,
          as: "service",
          where: { provider_id: providerid }
        }]
      }),

      Booking.count({
        where: { booking_status: "completed" },
        include: [{
          model: Service,
          as: "service",
          where: { provider_id: providerid }
        }]
      }),


      Booking.count({
        where: {
          booking_status: "pending",
          booking_date: { [Op.gte]: today }
        },
        include: [{
          model: Service,
          as: "service",
          where: { provider_id: providerid }
        }]
      }),


      Booking.findAll({
        attributes: [[fn("SUM", col("total_amount")), "totalEarnings"]],
        where: { booking_status: "completed" },
        include: [{
          model: Service,
          as: "service",
          attributes: [],
          where: { provider_id: providerid }
        }],

        raw: true
      })


    ]);

    const totalEarnings = (earningResults as any)[0]?.totalEarnings || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalServices,
        totalBookings,
        completedBookings,
        upcomingbookings,
        totalEarnings
      }
    });


  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Dashboard error" });
  }
}