import axios from "axios";

export function startHeartbeat({
  server,
  token,
  agentId,
}: {
  server: string;
  token: string;
  agentId: string;
}) {
  setInterval(() => {
    axios
      .post(
        `${server}/api/agent/heartbeat`,
        { agent_id: agentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .catch((err: any) => {
        console.error("Heartbeat failed:", err.message);
      });
  }, 10000);
}
