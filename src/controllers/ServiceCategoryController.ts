import type { Request, Response, NextFunction } from "express";
import ServiceCategory from "../models/service_category.js";
import { Op } from 'sequelize'



export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { service_category_name, description, status } = req.body;

    if (!service_category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await ServiceCategory.findOne({
      where: {
        service_category_name: {
          [Op.like]: service_category_name,
        },
      },
    });

    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }


    const category = await ServiceCategory.create({
      service_category_name,
      description,
      status: status || "active",
    });


    res.status(201).json(category);
  }
  catch (err) {
    next(err);
  }
}


export const getAllcategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const { count, rows } = await ServiceCategory.findAndCountAll({
      where: { status: "active" },
      limit,
      offset,
      order: [["created_at", "DESC"]]

    })


    res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  }
  catch (err) {
    next(err);
  }
}




export const getcategorybyid = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const category = await ServiceCategory.findByPk(id);

    if (!category || category.status !== "active") {
      return res.status(404).json({ message: "category not found" });

    }

    res.status(200).json(category);
  }
  catch (err) {
    next(err);
  }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const category = await ServiceCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "category not found" })
    }


    const { service_category_name, description, status } = req.body;


    if (!service_category_name && !description && !status) {
      return res.status(400).json({ message: "No data provided for update" });
    }



    if (service_category_name) {
      const existingCategory = await ServiceCategory.findOne({
        where: {
          service_category_name: {
            [Op.like]: service_category_name,
          },
          service_category_id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingCategory) {
        return res.status(409).json({ message: "Category name already exists" });
      }
    }

    await category.update({
      service_category_name: service_category_name ?? category.service_category_name,
      description: description ?? category.description,
      status: status ?? category.status,
    });



    res.status(200).json({ message: "updated sucessfully" });
  }
  catch (err) {
    next(err);
  }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const category = await ServiceCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "category not found" })
    }

    await category.update({ status: "inactive" })

    res.status(200).json({ message: "deleted sucessfully" });
  }
  catch (err) {
    next(err);
  }
}



