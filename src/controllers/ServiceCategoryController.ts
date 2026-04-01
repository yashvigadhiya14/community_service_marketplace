import type { Request,Response,NextFunction } from "express";
import ServiceCategory from "../models/service_category.js";
import { Op } from 'sequelize'



export const createCategory=async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const {service_category_name,description,status}=req.body;

    const category=await ServiceCategory.create({
      service_category_name,
      description,
      status,
    });

    res.status(201).json(category);
  }
  catch(err)
  {
    next(err);
  }
}


export const getAllcategories=async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const categories=await ServiceCategory.findAll({
      where:{status:"active"},
    });

    res.status(200).json(categories);
  }
  catch(err)
  {
    next(err);
  }
}




export const getcategorybyid=async(req:Request,res:Response,next:NextFunction)=>{
  try{

const id = Number(req.params.id); 

    const category = await ServiceCategory.findByPk(id);

    if(!category)
    {
      return res.status(404).json({message:"category not found"});

    }

    res.status(200).json(category);
  }
  catch(err)
  {
    next(err);
  }
}

export const updateCategory=async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const id = Number(req.params.id);

    const category = await ServiceCategory.findByPk(id);

    if(!category)
    {
      return res.status(404).json({message:"category not found"})
    }
    await category.update(req.body);

    res.status(200).json({message:"updated sucessfully"});
  }
  catch(err)
  {
    next(err);
  }
}

export const deleteCategory=async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const id = Number(req.params.id);

    const category = await ServiceCategory.findByPk(id);

    if(!category)
    {
      return res.status(404).json({message:"category not found"})
    }
await category.destroy({ force: true }); 
    res.status(200).json({message:"deleted sucessfully"});
  }
  catch(err)
  {
    next(err);
  }
}



