import { Request, Response } from "express";
import { PrismaClient } from "../../src/generated/prisma";
const prisma = new PrismaClient();

// Register a new agent or update existing
const register = async (req: Request, res: Response) => {
  try {
    const { hostname, os, arch, totalmem } = req.body;
    // Upsert agent by hostname (or other unique field)
    const agent = await prisma.agent.upsert({
      where: { hostname },
      update: { os, arch, totalmem, lastSeen: new Date() },
      create: { hostname, os, arch, totalmem, lastSeen: new Date() },
    });
    res.status(200).json({ agent_id: agent.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to register agent", error: String(err) });
  }
};

// Heartbeat: update agent's lastSeen
const heartbeat = async (req: Request, res: Response) => {
  try {
    const { agent_id } = req.body;
    await prisma.agent.update({ where: { id: agent_id }, data: { lastSeen: new Date() } });
    res.status(200).json({ message: "Heartbeat received" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update heartbeat", error: String(err) });
  }
};

// Poll for jobs assigned to this agent
const pullJobs = async (req: Request, res: Response) => {
  try {
    const agent_id = req.query.agent_id as string;
    // Find a pending job for this agent
    const job = await prisma.job.findFirst({ where: { agentId: Number(agent_id), status: "pending" } });
    if (job) {
      // Optionally mark as running
      await prisma.job.update({ where: { id: job.id }, data: { status: "running" } });
      res.status(200).json({ job });
    } else {
      res.status(200).json({ job: null });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to pull jobs", error: String(err) });
  }
};

// Receive job logs from agent
const jobLogs = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { type, message } = req.body;
    // Save log to DB (or file, or forward to logging service)
    await prisma.log.create({ data: { jobId: Number(jobId), type, message } });
    res.status(200).json({ message: "Log received" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save log", error: String(err) });
  }
};

// Receive job result from agent
const jobResult = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { status, exit_code } = req.body;
    await prisma.job.update({ where: { id: Number(jobId) }, data: { status, exitCode: exit_code, finishedAt: new Date() } });
    res.status(200).json({ message: "Job result received" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save job result", error: String(err) });
  }
};

// Shutdown: mark agent as offline
const shutdown = async (req: Request, res: Response) => {
  try {
    const { agent_id } = req.body;
    await prisma.agent.update({ where: { id: agent_id }, data: { isOnline: false, lastSeen: new Date() } });
    res.status(200).json({ message: "Agent shutdown successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to shutdown agent", error: String(err) });
  }
};

export const agentController = {
  register,
  heartbeat,
  pullJobs,
  jobLogs,
  jobResult,
  shutdown,
};
