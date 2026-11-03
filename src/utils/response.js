function sucessResponse(res,statusCode,data,message){
    return res.status(statusCode).json({
        succes:true,
        message,
        data
    });
}

function errorResponse(res,statusCode,data,message){
    return res.status(statusCode).json({
        succes:true,
        message,
        data
    });
}

module.exports ={ sucessResponse,errorResponse};
