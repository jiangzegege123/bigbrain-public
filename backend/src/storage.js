import fs from "fs";

const DATABASE_FILE = "./database.json";

// 检查是否在Vercel无服务器环境中
const isServerless = process.env.VERCEL || process.env.LAMBDA_TASK_ROOT;

// 内存存储 - 在无服务器环境中使用
let memoryStore = {
  admins: {},
  games: {},
  sessions: {},
};

// 文件存储 - 在本地开发环境中使用
const loadFromFile = () => {
  try {
    const data = JSON.parse(fs.readFileSync(DATABASE_FILE));
    return data;
  } catch {
    console.log("WARNING: No database found, create a new one");
    return { admins: {}, games: {}, sessions: {} };
  }
};

const saveToFile = (data) => {
  try {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Writing to database failed:", error);
    // 在无服务器环境中，文件写入可能失败，但不应该阻止程序运行
    console.warn("Falling back to memory storage");
  }
};

export const getStorage = () => {
  if (isServerless) {
    return memoryStore;
  } else {
    return loadFromFile();
  }
};

export const saveStorage = (data) => {
  if (isServerless) {
    // 在无服务器环境中，只更新内存存储
    memoryStore = { ...data };
    console.log("Data saved to memory (serverless environment)");
  } else {
    // 在本地环境中，保存到文件
    saveToFile(data);
  }
};

export const isServerlessEnvironment = () => isServerless;
