// agent-cli/index.ts
import axios from "axios";
import os from "os";
import { startHeartbeat } from "./heartbeat";
import { executeJob } from "./job-executor";
import { saveAgentState, loadAgentState } from "./state";

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

//agents will be our consumers of the queue
//they will poll for jobs and execute them

const token = process.env.DEVFLEET_TOKEN || getArg("--token") || "";
const server =
  getArg("--server") || process.env.SERVER_URL || "http://localhost:8000";

async function registerAgent(): Promise<string> {
  const res = await axios.post(
    `${server}/api/agent/register`,
    {
      hostname: os.hostname(),
      os: os.platform(),
      arch: os.arch(),
      totalmem: os.totalmem(),
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data.agent_id;
}

async function pollJobs(agentId: string) {
  try {
    const res = await axios.get(`${server}/api/agent/jobs/pull`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { agent_id: agentId },
    });
    const job = res.data.job;
    if (job) {
      // Directly execute jobs, allow parallel execution
      executeJob(job);
    }
  } catch (err: any) {
    console.error("Poll failed:", err.message);
  }
}

async function main() {
  let agentId = loadAgentState();
  if (!agentId) {
    agentId = await registerAgent();
    saveAgentState(agentId);
  }
  console.log("Agent ID:", agentId);
  startHeartbeat({ server, token, agentId });
  setInterval(() => pollJobs(agentId), 5000);
}

process.on("SIGINT", async () => {
  console.log("Shutting down agent...");
  try {
    let agentId = loadAgentState();
    if (agentId) {
      await axios.post(
        `${server}/api/agent/shutdown`,
        { agent_id: agentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Shutdown notification sent to server.");
    }
  } catch (err: any) {
    console.error("Failed to notify server of shutdown:", err.message);
  }
  process.exit(0);
});

main();
