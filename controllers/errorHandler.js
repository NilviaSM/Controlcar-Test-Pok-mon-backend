const errorHandler = (res, error, statusCode = 500, message = 'An unexpected error occurred') => {
    console.error(error); // Para fines de depuración en la terminal
    res.status(statusCode).json({
        error: message,
        details: error.message || error,
    });
};

module.exports = errorHandler;
