import type {Request,Response} from "express"
import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";
import Booking from "../models/bookingModel.js"

export const getAdminDashboard=async(req:Request,res:Response)=>{
  try{
    const totalusers=await User.count({
      where:{role:"customer"}
    });

    const totalproviders=await User.count({
      where:{role:"provider"}
    });

    const totalservices=await Service.count();

    const totalbookings=await Booking.count();

    const completedServices=await Booking.count({
      where:{booking_status:"completed"}
    });

    res.status(200).json({
      totalusers,
      totalproviders,
      totalservices,
      totalbookings,
      completedServices
    })

    

  }
  catch(error)
  {
    console.log(error);
    res.status(500).json({message:"Admin analytics error"});
  }
}