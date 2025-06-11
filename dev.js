const concurrently = require("concurrently");

// Kill any existing processes on our ports first
const { exec } = require("child_process");

function killExistingProcesses() {
  return new Promise((resolve) => {
    exec("lsof -ti:3000,5000 | xargs -r kill -9", () => {
      setTimeout(resolve, 1000);
    });
  });
}

async function startDev() {
  console.log("Starting LN Partners Groupware System...");

  await killExistingProcesses();

  const { result } = concurrently(
    [
      {
        command: "npm run dev",
        name: "client",
        cwd: "./client-nextjs",
        prefixColor: "blue",
      },
      {
        command: "node index.js",
        name: "server",
        cwd: "./server",
        prefixColor: "green",
      },
    ],
    {
      prefix: "name",
      killOthers: ["failure", "success"],
      restartTries: 3,
    },
  );

  try {
    await result;
  } catch (error) {
    console.error("Error starting services:", error);
    process.exit(1);
  }
}

startDev();
