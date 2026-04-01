import type { Request,Response } from "express";
import Service from "../models/serviceModel.js";
import Booking from "../models/bookingModel.js";
import sequelize from "../config/db.js";
import { Model, Op } from "sequelize";
import { fn, col } from "sequelize";



export const getProviderDashboard=async(req:any,res:Response)=>{
  try{
    const providerid=req.user.id;

    const totalservices=await Service.count({
      where:{provider_id:providerid}
    });

    const totalbookings=await Booking.count({
      include:[
        {
          model:Service,
          as:"service",
          where:{provider_id:providerid}
        }
      ]
    });

    const completedBookings=await Booking.count({
      where:{booking_status:"completed"},
      include:[
        {
          model:Service,
          as:"service",
          where:{provider_id:providerid}
        }
      ]
    });


    const upcomingbookings=await Booking.count({
      where:{
        booking_status:"pending",
        booking_date:{[Op.gt]:new Date()}
      },
      include:[
        {
          model:Service,
          as:"service",
          where:{provider_id:providerid}
        }
      ]
    });

    const result=await Booking.findAll({
      attributes:[
        [fn("SUM",col("total_amount")),"totalEarnings"]
      ],
      where:{booking_status:"completed"},
      include:[
        {
          model:Service,
          as:"service",
          attributes:[],
          where:{provider_id:providerid}
        }
      ],
      raw:true
    })as any;

    const earnings=result[0]?.totalEarnings || 0

    res.status(200).json({
      totalservices:totalservices,
      totalbookings:totalbookings,
      completedBookings,
      upcomingbookings:upcomingbookings,
      totalEarnings:earnings
    })

  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Dashboard error"});
  }
}