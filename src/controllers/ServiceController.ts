import type { Request,Response,NextFunction } from "express";
import {Op,fn, col, where, Association} from "sequelize";
import { Service, ServiceAvailability } from "../models/index.js";
import User from "../models/userModel.js";
import ServiceCategory from "../models/service_category.js";


export const createservice=async(req:any,res:Response)=>{
  try{
    const{
      title,
      service_description,
      category_id,
      price,
      location,
      availability,
      city,

    }=req.body


    if (!title || !service_description || !category_id || !price || !location) {
      return res.status(400).json({
        message: "All required fields must be provided",
      })
    }

    if(req.user.role!=="provider"){
      return res.status(403).json({
        message:"only service provider can create servce"
      })
    }


    const service=await Service.create({
      provider_id:req.user.id,
      title,
      service_description,
      category_id,
      price,
      location,
      availability,
      city,
    })

    return res.status(201).json({
      message:"service craeted sucessfully",
      data:service,
    })

  }
  catch(error)
  {
    return res.status(500).json({
      message:"failed to create service"
    })
  }
}

export const updateService=async(req:any,res:Response)=>{
  try{
    const service=await Service.findByPk(req.params.id)

    if(!service)
    {
      return res.status(404).json({
        message:"service not found"
      })
    }

    if(req.user.role!=="provider")
    {
      return res.status(403).json({
        message:"only service provider can update service"
      })
    }

    await service.update(req.body)

    return res.status(200).json({
      message: "Service updated successfully",
      data: service
    })

  }
  catch(error)
  {
    return res.status(500).json({
      message:"error updating service"
    })
  }
}





export const deleteService = async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({
        message: "service not found"
      });
    }

    if (req.user.role !== "provider") {
      return res.status(403).json({
        message: "only service provider can delete service"
      });
    }

    if (service.provider_id !== req.user.id) {
      return res.status(403).json({
        message: "you can delete only your own service"
      });
    }

    await service.destroy({ force: true });

    return res.status(200).json({
      message: "service deleted successfully"
    });

  } catch (err) {
    next(err);
  }
};

export const getServices = async (req:any, res:any) => {
  try {
    const services = await Service.findAll({
      
      attributes: ["service_id","title","service_description","price","location","city"],
      include: [
        { model: User, as: "provider", attributes: ["user_id","username","email"] },
        { model: ServiceAvailability, as: "availabilitySlots", attributes: ["availability_id","available_date"], required: false },
        { model: ServiceCategory, as: "category", attributes: ["service_category_id","service_category_name"], required: false },
      ],
    });
 
    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error:any) {
    console.error("getServices error", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching services",
      error: error?.message || "Internal Server Error",
    });
  }
};

export const searchServices=async(req:any,res:any)=>{
  try{
 const keyword = req.query.keyword?.toLowerCase().trim();
    const data=await Service.findAll({
           where: {
        [Op.or]: [
          where(fn("LOWER", col("title")), {
            [Op.like]: `%${keyword}%`,
          }),
          where(fn("LOWER", col("service_description")), {
            [Op.like]: `%${keyword}%`,
          }),
        ],
      },
    });

    res.json({
      success:true,
      data
    })

  }
  catch(error)
  {
    res.json({
      success:false,
      message:"Error",
    })
  }
}

export const filterservices=async(req:any,res:any)=>{
  try{
    const category_id=req.query.category_id;

    const data=await Service.findAll({
      where:{category_id:Number(category_id)},
    });
    return res.json({

      success:true,
      count:data.length,
      data,
    })

  }
  catch(err)
  {
    res.json({
      success:false,
      message:"Error",
    });
  }
};



export const sortservices=async(req:any,res:any)=>{
  try{
    const order=req.query.order || "ASC";

      const data=await Service.findAll({
        order:[["price",order]],
      });
      return res.json({
        success:true,
        count:data.length,
        data,
      });
  }
  catch(err)
  {
    res.json({
      success:false,
      message:"Error",
    });
  }
}

export const getProviderServices = async (req: any, res: Response) => {
  try {
    const provider_id = req.user.id; 

    const services = await Service.findAll({
      where: { provider_id }, 
      attributes: [
        "service_id",
        "title",
        "service_description",
        "price",
        "location",
        "city",
      ],
      include: [
        {
          model: ServiceCategory,
          as: "category",
          attributes: ["service_category_name"],
          required: false,
        },
        {
          model: ServiceAvailability,
          as: "availabilitySlots",
          attributes: ["availability_id", "available_date"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });

  } catch (error: any) {
    console.error("getProviderServices error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching provider services",
      error: error.message,
    });
  }
};



