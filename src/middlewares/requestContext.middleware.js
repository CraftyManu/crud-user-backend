import logger from "../helpers/logger.js";

const requestContextMiddleware = (req, res, next) => {
    const user = req.user || {};

    req.logContext = {
        requestId: req.headers["x-request-id"] || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        userId: user.userId || null,
        email: user.email || null,
        role: user.role || null,
    };

    req.logger = logger.withContext(req.logContext);
    req.logger.debug("Request context initialized");
    next();
};

export default requestContextMiddleware;
