import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { errorResponse } from "../helpers/response.helper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../");
const logsDir = path.join(projectRoot, "logs");

const parseLogLine = (line) => {
  const match = line.match(/^\[(.*?)\]\s+\[(DEBUG|INFO|WARN|ERROR)\]\s*(.*)$/i);

  if (!match) {
    return {
      timestamp: null,
      level: "INFO",
      message: line.trim(),
    };
  }

  const [, timestamp, level, message] = match;

  return {
    timestamp,
    level: level.toUpperCase(),
    message: message.trim(),
  };
};

const readLogFile = (fileName) => {
  const filePath = path.join(logsDir, fileName);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.trim())
    .map(parseLogLine);
};

const getSessionLogs = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, "Se requiere el id de la sesión", 400);
    }

    const allLogs = readLogFile("all.log");
    const sessionLogs = allLogs.filter((entry) => {
      const message = entry.message || "";
      return message.includes(`requestId=${id}`) || message.includes(`sessionId=${id}`);
    });

    return res.status(200).json({
      success: true,
      sessionId: id,
      count: sessionLogs.length,
      logs: sessionLogs,
    });
  } catch (error) {
    return errorResponse(res, "No se pudieron obtener los logs de la sesión", 500, error.message);
  }
};

export { getSessionLogs };
