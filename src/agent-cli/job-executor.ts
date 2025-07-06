import axios from "axios";
import { spawn } from "child_process";

export async function executeJob(job: any) {
  const proc = spawn(job.command, {
    shell: true,
    env: { ...process.env, ...job.env },
  });

  proc.stdout.on("data", (data: Buffer) => {
    sendLog(job.id, "stdout", data.toString());
  });

  proc.stderr.on("data", (data: Buffer) => {
    sendLog(job.id, "stderr", data.toString());
  });

  proc.on("close", (code: number) => {
    reportResult(job.id, code === 0 ? "success" : "failed", code);
  });
}

async function sendLog(jobId: string, type: string, message: string) {
  await axios.post(
    `${process.env.SERVER_URL || ""}/api/agent/job/${jobId}/logs`,
    {
      type,
      message,
    },
    {
      headers: { Authorization: `Bearer ${process.env.DEVFLEET_TOKEN || ""}` },
    }
  );
}

async function reportResult(jobId: string, status: string, code: number) {
  await axios.post(
    `${process.env.SERVER_URL || ""}/api/agent/job/${jobId}/result`,
    {
      status,
      exit_code: code,
    },
    {
      headers: { Authorization: `Bearer ${process.env.DEVFLEET_TOKEN || ""}` },
    }
  );
}
