
function ErrorHandler(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

export default ErrorHandler

export const TryCatch = (func) => (req, res, next) => {
     return Promise.resolve(func(req, res, next)).catch(next)
}


