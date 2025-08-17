import logger from "../middleware/winston.js";

const errorHandling=(err,req,res,next)=>{
    const message=err.message.split(" - ")[1];
    logger.error(err);
    res.status(500).json({
        error: [message],
        message: err.message,
        data: null
    });
}

export default errorHandling;
