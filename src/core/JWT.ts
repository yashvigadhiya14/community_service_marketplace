import jwt from "jsonwebtoken"

export const generateAccessToken=(user:any)=>{
  return jwt.sign(
    {id:user.user_id,role:user.role},
    process.env.JWT_SECRET as string,
    {expiresIn:"1d"}
  )
}

export const generateRefreshToken=(user:any)=>{
  return jwt.sign(
    {id:user.user_id},
    process.env.JWT_REFRESH_SECRET as string,
    {expiresIn:"7d"}
  )
}


