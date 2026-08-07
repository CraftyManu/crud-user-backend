import logger from "../helpers/logger.js";

const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const requestLogger = logger.withContext(req.logContext);
        requestLogger.info(
            "HTTP",
            req.method,
            req.originalUrl || req.url,
            "->",
            res.statusCode,
            `(${duration}ms)`
        );
    });

    next();
};

export default requestLogger;
