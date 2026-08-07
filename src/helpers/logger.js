import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../");
const logsDir = path.join(projectRoot, "logs");

const levelValues = {
    DEBUG: 10,
    INFO: 20,
    WARN: 30,
    ERROR: 40,
};

const configuredLevel = (process.env.LOG_LEVEL || "INFO").toUpperCase();
const currentLevel = levelValues[configuredLevel] || levelValues.INFO;

const ensureLogsDirectory = () => {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
};

/* const createTimestamp = () => new Date().toISOString(); */
const createTimestamp = () => {
    return new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        dateStyle: 'short',
        timeStyle: 'medium',
        hour12: false
    }).format(new Date());
};

const serialize = (value) => {
    if (value instanceof Error) {
        return `${value.message}\n${value.stack || ""}`.trim();
    }

    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "object") {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    return String(value);
};

const buildMessage = (args) => args.map(serialize).filter(Boolean).join(" | ");

const formatWithContext = (message, context) => {
    if (!context || Object.keys(context).length === 0) {
        return message;
    }

    const contextMessage = Object.entries(context)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `${key}=${value}`)
        .join(" ");

    return `${message} | ${contextMessage}`;
};

const writeToFile = (level, message) => {
    ensureLogsDirectory();

    const filePath = path.join(logsDir, `${level.toLowerCase()}.log`);
    const combinedFilePath = path.join(logsDir, "all.log");
    const line = `[${createTimestamp()}] [${level}] ${message}\n`;

    fs.appendFileSync(filePath, line, "utf8");
    fs.appendFileSync(combinedFilePath, line, "utf8");
};

const log = (level, ...args) => {
    if (levelValues[level] < currentLevel) {
        return;
    }

    const context = typeof args[args.length - 1] === "object" && !Array.isArray(args[args.length - 1]) && !(args[args.length - 1] instanceof Error)
        ? args.pop()
        : null;

    const message = buildMessage(args);
    const contextualMessage = formatWithContext(message, context);
    const output = `[${createTimestamp()}] [${level}] ${contextualMessage}`;

    writeToFile(level, contextualMessage);

    if (level === "ERROR") {
        console.error(output);
    } else if (level === "WARN") {
        console.warn(output);
    } else if (level === "DEBUG") {
        console.debug(output);
    } else {
        console.log(output);
    }
};

const logger = {
    debug: (...args) => log("DEBUG", ...args),
    info: (...args) => log("INFO", ...args),
    warn: (...args) => log("WARN", ...args),
    error: (...args) => log("ERROR", ...args),
    withContext: (context) => ({
        debug: (...args) => log("DEBUG", ...args, context),
        info: (...args) => log("INFO", ...args, context),
        warn: (...args) => log("WARN", ...args, context),
        error: (...args) => log("ERROR", ...args, context),
    }),
};

export default logger;
