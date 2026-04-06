import type { Request, Response } from "express";
import Review from "../models/reviewModel.js";
import sequelize from "../config/db.js";
import service from "../models/serviceModel.js"

export const addReview = async (req: any, res: Response) => {
  try {
    const { service_id, rating, review_text } = req.body;

    const customer_id = req.user.id;


    const review = await Review.create({
      service_id,
      customer_id,
      rating,
      review_text
    });

    res.status(201).json({
      message: "review added sucessfully",
      review
    });

  }
  catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "You already reviewed this service",
      });
    }

    console.error("ADD REVIEW ERROR:", error);
    res.status(500).json({ message: "Error", error });
  }
}

export const getProviderRating = async (req: any, res: Response) => {
  try {
    const { provider_id } = req.params;
    const result: any = await Review.findOne({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("review_id")), "totalreviews"]

      ],
      include: [
        {
          model: service,
          attributes: [],
          where: { provider_id }
        }
      ],
      raw: true
    });
    res.json({
      provider_id,
      average_rating: Number(result?.avgRating || 0).toFixed(1),
      total_reviews: result?.totalreviews || 0
    });
  }
  catch (error: any) {
    console.error("AVG ERROR:", error);
    res.status(500).json({ message: error.message });

  }
}

export const getReviews = async (req: Request, res: Response) => {
  try {

    const { service_id } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { service_id },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: ["review_id", "rating", "review_text", "createdAt"],




    });
    return res.json({
      total: reviews.count,
      page,
      totalPages: Math.ceil(reviews.count / limit),
      data: reviews.rows
    })
  }
  catch (error: any) {
    res.status(500).json({
      message: "error fetching reviews",
      error: error.message,
    });
  }
};


export const updateReview = async (req: any, res: Response) => {
  try {
    const { review_id } = req.params;
    const { rating, review_text } = req.body;

    const review = await Review.findByPk(review_id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // if(review.customer_id!==req.user.id)
    // {
    //   return res.status(403).json({
    //     message:"not authorized",
    //   });
    // }

    await review.update({
      rating,
      review_text
    });

    res.json({
      message: "review updated successfully",
      data: review,
    });

  }
  catch (error: any) {
    res.status(500).json({
      message: "error updating reviews",
      error: error.message,
    });
  }
}

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review_id = Number(req.params.review_id);

    if (isNaN(review_id)) {
      return res.status(400).json({
        message: "Invalid review ID",
      });
    }


    const review = await Review.findByPk(review_id);

    if (!review) {
      return res.status(404).json({
        message: "review not found",
      })
    }

    await review.destroy();

    res.json({
      message: "Review deleted successfully",
    });
  }
  catch (error: any) {
    res.status(500).json({
      message: "Error deleting review",
      error: error.message,
    })
  }
}