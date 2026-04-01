import jwt from "jsonwebtoken"

export const verifyToken = (req:any,res:any,next:any)=>{

  const authHeader = req.headers.authorization

  if(!authHeader){
    return res.status(401).json({
      message:"access token required"
    })
  }

  const token = authHeader.split(" ")[1]

  try{

    const decoded:any = jwt.verify(token,process.env.JWT_SECRET!)

    req.user = decoded

    next()

  }
  catch(error){

    return res.status(401).json({
      message:"invalid or expired token"
    })

  }

}

export const authorizeRoles = (...roles:string[])=>{
  return (req:any,res:any,next:any)=>{

    if(!roles.includes(req.user.role)){
      return res.status(403).json({
        message:"access denied"
      })
    }

    next()

  }
}

export const isAdmin=(req:any,res:any,next:any)=>{
  if(req.user.role!=="admin")
  {
    return res.status(403).json({
      message:"access denied.admin only"
    })
  }
  next();
};
