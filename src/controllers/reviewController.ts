import type { Request,Response } from "express";
import Review from "../models/reviewModel.js";
import sequelize from "../config/db.js";
import service from "../models/serviceModel.js"

export const addReview=async(req:any,res:Response)=>{
  try{
    const {service_id,rating,review_text}=req.body;

    const customer_id=req.user.id;

    if(!service_id || !rating)
    {
      return res.status(400).json({
        message:"service_id and rating required"
      });
    }

    if(rating<1 || rating>5)
    {
      return res.status(400).json({
        message:"rating must be between 1 to 5"
      });
    }

    const review=await Review.create({
      service_id,
      customer_id,
      rating,
      review_text
    });

    res.status(201).json({
      message:"review added sucessfully",
      review
    });

  }
  catch(error:any)
  {
    console.error("ADD REVIEW ERROR:", error); 
    res.status(500).json({message:"Error",error});
  }
}

export const getProviderRating=async(req:any,res:Response)=>{
  try{
    const {provider_id}=req.params;
    const result:any=await Review.findOne({
      attributes:[
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("review_id")), "totalreviews"]

      ],
      include:[
        {
          model:service,
          attributes:[],
          where:{provider_id}
        }
      ],
      raw:true
    });
    res.json({
      provider_id,
      average_rating:Number(result?.avgRating || 0).toFixed(1),
      total_reviews:result?.totalreviews || 0
    });
  }
  catch(error:any)
  {
    console.error("AVG ERROR:", error);
    res.status(500).json({ message: error.message });

  }
}
