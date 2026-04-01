import type {Request,Response} from "express";
import {ServiceAvailability} from "../models/index.js";


export const addAvailability=async(req:any,res:Response)=>{
  try{
    const {service_id,slots}=req.body;

    if(!service_id || !slots || !Array.isArray(slots))
    {
      return res.status(400).json({
        message:"service id and slot are required"
      });
    }
    const today=new Date();
    today.setHours(0,0,0,0);

    for(const slot of slots)
    {
      const slotDate=new Date(slot.available_date);

      if(slotDate<today)
      {
        return res.status(400).json({
          message:`can not add past date:${slot.available_date}`
        });
      }
    }

    const data=await ServiceAvailability.bulkCreate(
      slots.map((slot:any)=>({
        service_id,
        available_date:slot.available_date,
        start_time:slot.start_time,
        end_time:slot.end_time

      }))

    );


    return res.status(201).json({
      message:"Availability added successfully",
    })
}
catch(error)
{

  console.log("Availability Error:", error); 


    return res.status(500).json({
    message:"error adding availability"
  });
}
}


export const getAvailabilityByService=async(req:Request,res:Response)=>{
  try{

    const service_id=Number(req.params.service_id);

    const data=await ServiceAvailability.findAll({
      where:{service_id}
    });

    return res.json({
      success:true,
      data
    })

  }
  catch(error)
  {
    return res.status(500).json({
      message:"error fetching avaialability"
    })
  }
}
