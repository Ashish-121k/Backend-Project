// Approach:1 (by promise)
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err));
    }
}

export {asyncHandler}

//Approach: 2 (by try catch)
// const asyncHandler = () => {}
// const asyncHandler = (func) => {() =>{}}
// const asyncHanler = (func) => async () => {}

/*
const asyncHandler = (func) =>  async(req, res, next) => {
    try {
           await func(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }

}
*/
