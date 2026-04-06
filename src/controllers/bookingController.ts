import type { Request, Response } from "express";
import sequelize from "../config/db.js"
import Booking from "../models/bookingModel.js";
import ServiceAvailability from "../models/ServiceAvailability.js";
import { Transaction } from "sequelize";
import { Op } from "sequelize";
import Service from "../models/serviceModel.js";
import { BOOKING_STATUS } from "../constants/bookingStatus.js";

export const createbooking = async (req: any, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const {
      service_id,
      booking_date,
      booking_time,
      billing_name,
      billing_email,
      billing_phone,
      billing_address,
      total_amount,
    } = req.body;

    const customer_id = req.user.id;

    // ✅ normalize today (IMPORTANT)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(booking_date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot book past date",
      });
    }

    // ✅ lock slot properly
    const slot = await ServiceAvailability.findOne({
      where: {
        service_id,
        available_date: booking_date,
        is_booked: false,
        start_time: { [Op.lte]: booking_time },
        end_time: { [Op.gte]: booking_time },
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!slot) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Slot not available",
      });
    }

    // ✅ create booking
    const booking = await Booking.create(
      {
        service_id,
        customer_id,
        booking_date,
        booking_time,
        booking_status: BOOKING_STATUS.PENDING,
        billing_name,
        billing_email,
        billing_phone,
        billing_address,
        total_amount,
      },
      { transaction: t }
    );

    // ✅ mark slot booked (FIX IMPORTANT)
    await slot.update(
      { is_booked: true },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });

  } catch (error: any) {
    await t.rollback();

    return res.status(500).json({
      success: false,
      message: error.message || "Booking failed",
    });
  }
};


export const getCustomerBookings = async (req: any, res: Response) => {
  try {

    const customer_id = req.user.id;

    const bookings = await Booking.findAll({
      where: { customer_id },
      order: [["created_at", "DESC"]],
    });

    res.json({
      message: "customer bookings fetched",
      data: bookings,
    })

  }
  catch (error: any) {
    res.status(500).json({
      message: "error fetching bookings",
      error: error.message,
    })
  }
}


export const getProviderBookings = async (req: any, res: Response) => {
  try {
    const provider_id = req.user.id;
    const bookings = await Booking.findAll({
      include: [
        {
          model: Service,
          as: "service",
          where: { provider_id: provider_id },
          attributes: ["service_id", "title", "price",]
        },


      ],

      order: [["created_at", "DESC"]],


    })
    return res.status(200).json({
      message: "provider bookings fetched successfully",
      data: bookings,
    })

  }
  catch (error: any) {
    console.log("provider booking error:", error);

    return res.status(500).json({
      message: "error fetching provider bookings",
      error: error.message,
    });

  }

}




export const updateBookingStatus = async (req: any, res: Response) => {
  try {
    const { booking_id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(booking_id);

    if (!booking) {
      return res.status(400).json({ message: "booking not found" });

    }

    await booking.update({ booking_status: status });


    res.json({ message: `Booking ${status} sucessfully`, data: booking })

  }
  catch (error: any) {
    res.status(500).json({
      message: "error updating booking",
      error: error.message,
    })
  }
}

export const completeBooking = async (req: any, res: Response) => {
  try {

    const { booking_id } = req.params;

    const booking = await Booking.findByPk(booking_id);

    if (!booking) {
      return res.status(404).json({ message: "booking not found" });
    }

    if (booking.booking_status !== "confirmed") {
      return res.json({
        message: "only confirmed booking can be completed",
      });
    }

    await booking.update({ booking_status: "completed" });

    res.json({
      message: "boooking completed",
      data: booking,
    })

  }
  catch (error: any) {
    res.status(500).json({
      message: "error completing booking",
      error: error.message,
    });
  }
}

export const cancelbooking = async (req: any, res: Response) => {
  try {
    const { booking_id } = req.params;

    const booking = await Booking.findByPk(booking_id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await booking.update({ booking_status: "cancelled" });

    res.json({
      message: "Booking cancelled",
      data: booking,
    })

  }
  catch (error: any) {
    res.status(500).json({
      message: "error canceling booking",
      error: error.message,
    })
  }

}






