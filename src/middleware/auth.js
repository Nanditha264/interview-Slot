function authenticate(req,res,next){
    const userId=req.headers["x-user-id"];
    const role=req.headers["x-user-role"];

    if(!userId || !role)
        return res.status(401).json({
            success:false,
            code:"UNATHORIZED",
            message:"Missing authentication headers"
    });
    if(!["recruiter" ,"candidate"].includes(role)){
        return res.status(403).json({
            success:false,
            code:"FORBIDDEN",
            message:"INVALID USER ROLE"

        });
    }
    req.user ={
        id:userId,
        role:role
    };
    next();
}

function authorize( ... allowedRoles)
{
    return (req,res,next) =>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success:false,
                code:"FORBIDDEN",
                message:"You donot have the permission "

            });
        }
        next();
    };
}


MediaSourceHandle.exports={authenticate,authorize};