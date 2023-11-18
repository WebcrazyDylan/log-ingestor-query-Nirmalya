import axios from "axios";
import { v4 as uuid } from "uuid";

const URL = "http://localhost:3000/api";

const getRandomLevel = (): string => {
  const levels = ["error", "warning", "info"];
  return levels[Math.floor(Math.random() * levels.length)];
};

const getRandomMessage = (): string => {
  const messages = [
    "Failed to connect to DB",
    "Service unavailable",
    "Request timed out",
    "Internal server error",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

const getRandomResourceId = (): string => {
  const resourceIds = ["server-1234", "server-0987", "server-5678"];
  return resourceIds[Math.floor(Math.random() * resourceIds.length)];
};

const getRandomTimestamp = (): Date => {
  const minDate = new Date("2023-01-01T00:00:00Z");
  const maxDate = new Date();
  const randomDate = new Date(
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime())
  );
  return randomDate;
};

const getRandomCommit = (): string => {
  const commits = ["5e5342f", "1a2b3c4d", "ef53a278"];
  return commits[Math.floor(Math.random() * commits.length)];
};

const generateLogEntry = () => {
  return {
    level: getRandomLevel(),
    message: getRandomMessage(),
    resourceId: getRandomResourceId(),
    timestamp: getRandomTimestamp(),
    traceId: uuid(),
    spanId: uuid(),
    commit: getRandomCommit(),
    metadata: {
      parentResourceId: getRandomResourceId(),
    },
  };
};

const sendLogEntry = async () => {
  try {
    const log = generateLogEntry();
    await axios.post(URL, log);
    console.log(
      `Log entry sent successfully with ${
        (log.commit,
        log.level,
        log.spanId,
        log.message,
        log.metadata.parentResourceId,
        log.timestamp,
        log.resourceId,
        log.traceId)
      } value.`
    );
  } catch (error) {
    console.error("Error sending log entry:", error);
  }
};

const sendLogEntries = async () => {
  for (let i = 0; i < 10; i++) {
    await sendLogEntry();
  }
};

sendLogEntries();
