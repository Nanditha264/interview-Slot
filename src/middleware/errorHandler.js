function errorHandler(err,req,res,next){
    console.error(err);
    const statusCode =err.statusCode || 500;
    res.statusCode (statusCode).json({
        sucess:false,
        code:err.code || "INTERNAL_SEVER_ERROR",
        message:err.message || "SOMETHINGG WENT WRONG"
    });

}

module.exports =errorHandler;