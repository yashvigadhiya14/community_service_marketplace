import { validationResult } from "express-validator";
import {body} from "express-validator"

export const validate=(req:any,res:any,next:any)=>{
  const errors=validationResult(req)

  if(!errors.isEmpty())
  {
    return res.status(400).json({
      errors:errors.array()
    })
  }
  next()
}


export const registerValidation=[
  body("username")
  .notEmpty()
  .withMessage("username is empty"),

  body("email")
  .isEmail()
  .withMessage("valid email required"),

  body("password")
  .isLength({min:6})
  .withMessage("password must be at leat 6 characters"),

  body("role")
  .notEmpty()
  .withMessage("role is required")
]


export const loginValidation=[

  body("email")
  .isEmail()
  .withMessage("valid email required"),

  body("password")
  .notEmpty()
  .withMessage("password required"),

]
