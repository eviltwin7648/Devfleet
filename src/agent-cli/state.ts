import fs from "fs";
import path from "path";
import os from "os";

const CONFIG_FILE = path.join(os.homedir(), ".devfleet-agent");

type AgentState = {
  agent_id: string;
};

export function saveAgentState(agentId: string) {
  const state: AgentState = { agent_id: agentId };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(state), { encoding: "utf-8" });
}

export function loadAgentState(): string | null {
  if (!fs.existsSync(CONFIG_FILE)) return null;
  try {
    const content = fs.readFileSync(CONFIG_FILE, "utf-8");
    const state = JSON.parse(content) as AgentState;
    return state.agent_id;
  } catch (err) {
    console.error("Failed to load agent state:", err);
    return null;
  }
}
