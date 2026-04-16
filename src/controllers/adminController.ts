import type { Request, Response } from "express"
import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";
import Booking from "../models/bookingModel.js"
import { Op } from "sequelize";

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


export const getAllUsers = async (req: any, res: Response) => {
  try {
    const { role, status, page, limit } = req.query;

    const where: any = {
      [Op.and]: [
        { role: { [Op.ne]: "admin" } },
        { user_id: { [Op.ne]: req.user.id } }
      ]
    };

    if (role && role !== "admin") {
      where[Op.and].push({ role });
    }

    if (status) {
      where[Op.and].push({ status });
    }

    const attributes = [
      "user_id",
      "username",
      "email",
      "role",
      "status",
      "phone",
      "created_at"
    ];

    if (!page && !limit) {
      const users = await User.findAll({
        where,
        attributes,
        order: [["user_id", "DESC"]],
      });

      return res.json({
        success: true,
        total: users.length,
        data: users,
      });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes,
      limit: limitNumber,
      offset,
      order: [["user_id", "DESC"]],
    });

    return res.json({
      success: true,
      total: count,
      page: pageNumber,
      totalPages: Math.ceil(count / limitNumber),
      data: rows,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });
  }
};

export const toggleUserStatus = async (req: any, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    (user as any).status = (user as any).status === "active" ? "blocked" : "active";
    await user.save();

    return res.json({
      success: true,
      message: "User status updated",
      data: user,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

export const getAllServicesAdmin = async (req: any, res: Response) => {
  try {
    const { category_id, minPrice, maxPrice, page, limit } = req.query;

    const where: any = {};

    if (category_id) where.category_id = Number(category_id);

    if (minPrice && maxPrice) {
      where.price = {
        [Op.between]: [Number(minPrice), Number(maxPrice)],
      };
    }

    if (!page && !limit) {
      const services = await Service.findAll({
        where,
        order: [["service_id", "DESC"]],
      });

      return res.json({
        success: true,
        total: services.length,
        data: services,
      });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows } = await Service.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [["service_id", "DESC"]],
    });

    return res.json({
      success: true,
      total: count,
      page: pageNumber,
      totalPages: Math.ceil(count / limitNumber),
      data: rows,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching services" });
  }
};

export const getAllBookingsAdmin = async (req: any, res: Response) => {
  try {
    const { status, page, limit } = req.query;

    const where: any = {};
    if (status) where.booking_status = status;

    if (!page && !limit) {
      const bookings = await Booking.findAll({
        where,
        order: [["booking_id", "DESC"]],
      });

      return res.json({
        success: true,
        total: bookings.length,
        data: bookings,
      });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows } = await Booking.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [["booking_id", "DESC"]],
    });

    return res.json({
      success: true,
      total: count,
      page: pageNumber,
      totalPages: Math.ceil(count / limitNumber),
      data: rows,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings" });
  }
};