export const getProfile=async(req:any,res:any)=>{
  res.json({
    message:"profile fetched",
    user:req.user
  })
}