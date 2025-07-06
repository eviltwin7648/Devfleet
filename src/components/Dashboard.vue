<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="container">
        <h1>DevFleet Dashboard</h1>
        <div class="user-menu">
          <span>Welcome to DevFleet!</span>
          <button @click="handleLogout" class="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="container">
        <!-- Onboarding Section -->
        <div v-if="!hasConnectedAgents" class="onboarding-section">
          <div class="welcome-card">
            <h2>🚀 Welcome to DevFleet!</h2>
            <p>Let's get you started by setting up your first agent.</p>
          </div>

          <!-- Agent Setup Wizard -->
          <div class="setup-wizard">
            <div class="wizard-step">
              <div class="step-header">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h3>Get Your Agent Token</h3>
                  <p>Copy this token to connect your first agent</p>
                </div>
              </div>

              <div class="token-section">
                <div class="token-display">
                  <code>{{ agentToken }}</code>
                  <button @click="copyToken" class="copy-btn" :class="{ 'copied': tokenCopied }">
                    <svg v-if="!tokenCopied" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    {{ tokenCopied ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="wizard-step">
              <div class="step-header">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h3>Connect Your Agent</h3>
                  <p>Run this command on your server or local machine</p>
                </div>
              </div>

              <div class="command-section">
                <div class="os-tabs">
                  <button 
                    v-for="os in osTabs" 
                    :key="os.id"
                    @click="selectedOS = os.id"
                    :class="['os-tab', { 'active': selectedOS === os.id }]"
                  >
                    {{ os.name }}
                  </button>
                </div>

                <div class="command-display">
                  <code>{{ getInstallCommand() }}</code>
                  <button @click="copyCommand" class="copy-btn" :class="{ 'copied': commandCopied }">
                    <svg v-if="!commandCopied" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    {{ commandCopied ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="wizard-step">
              <div class="step-header">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h3>Wait for Connection</h3>
                  <p>Your agent will appear below once connected</p>
                </div>
              </div>

              <div class="connection-status">
                <div class="loading-indicator">
                  <div class="spinner"></div>
                  <span>Waiting for agent connection...</span>
                </div>
                <button @click="refreshAgents" class="refresh-btn">
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Dashboard (shown when agents are connected) -->
        <div v-else class="main-dashboard">
          <div class="dashboard-actions">
            <button @click="showNewJobModal = true" class="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              New Job
            </button>
          </div>

          <!-- Connected Agents Section -->
          <div class="agents-section">
            <h3>Connected Agents</h3>
            <div class="agents-grid">
              <div 
                v-for="agent in agents" 
                :key="agent.id"
                class="agent-card"
              >
                <div class="agent-header">
                  <div class="agent-status">
                    <div :class="['status-indicator', agent.status]"></div>
                    <span class="hostname">{{ agent.hostname }}</span>
                  </div>
                  <div class="agent-actions">
                    <button @click="tagAgent(agent)" class="action-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.5 7A1.5 1.5 0 004 5.5V4a2 2 0 012-2h1.5A1.5 1.5 0 009 3.5V4h6v-.5A1.5 1.5 0 0116.5 2H18a2 2 0 012 2v1.5A1.5 1.5 0 0118.5 7H18v10h.5a1.5 1.5 0 011.5 1.5V20a2 2 0 01-2 2h-1.5a1.5 1.5 0 01-1.5-1.5V20H9v.5A1.5 1.5 0 007.5 22H6a2 2 0 01-2-2v-1.5A1.5 1.5 0 015.5 17H6V7h-.5z"/>
                      </svg>
                    </button>
                    <button @click="disconnectAgent(agent)" class="action-btn danger">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13H5v-2h14v2z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="agent-details">
                  <div class="detail-item">
                    <span class="label">OS:</span>
                    <span class="value">{{ agent.os }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Last Seen:</span>
                    <span class="value">{{ formatLastSeen(agent.lastSeen) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Concurrency:</span>
                    <span class="value">{{ agent.concurrency }}</span>
                  </div>
                </div>

                <div v-if="agent.tags.length > 0" class="agent-tags">
                  <span 
                    v-for="tag in agent.tags" 
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Jobs Section -->
          <div class="jobs-section">
            <h3>Recent Jobs</h3>
            <div v-if="jobs.length === 0" class="empty-state">
              <p>No jobs yet. Create your first job to get started!</p>
            </div>
            <div v-else class="jobs-list">
              <div 
                v-for="job in jobs" 
                :key="job.id"
                class="job-item"
              >
                <div class="job-header">
                  <h4>{{ job.name }}</h4>
                  <span :class="['job-status', job.status]">{{ job.status }}</span>
                </div>
                <p class="job-description">{{ job.description || 'No description' }}</p>
                <div class="job-meta">
                  <span>Agent: {{ getAgentName(job.agentId) }}</span>
                  <span>Created: {{ formatDate(job.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- New Job Modal -->
        <div v-if="showNewJobModal" class="modal-overlay" @click="closeModal">
          <div class="modal" @click.stop>
            <div class="modal-header">
              <h3>Create New Job</h3>
              <button @click="closeModal" class="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <form @submit.prevent="createJob" class="job-form">
              <div class="form-group">
                <label for="jobName">Job Name</label>
                <input 
                  id="jobName"
                  v-model="newJob.name" 
                  type="text" 
                  placeholder="My Awesome Job"
                  required
                />
              </div>

              <div class="form-group">
                <label for="jobScript">Bash Script</label>
                <textarea 
                  id="jobScript"
                  v-model="newJob.script" 
                  placeholder="#!/bin/bash&#10;echo 'Hello DevFleet!'"
                  rows="8"
                  required
                ></textarea>
                <input 
                  type="file" 
                  accept=".sh" 
                  class="file-input"
                  @change="handleScriptUpload"
                />
              </div>

              <div class="form-group">
                <label>Environment Variables (Optional)</label>
                <div class="env-vars">
                  <div 
                    v-for="(env, index) in newJob.env" 
                    :key="index"
                    class="env-row"
                  >
                    <input 
                      v-model="env.key" 
                      type="text" 
                      placeholder="KEY"
                      class="env-key"
                    />
                    <input 
                      v-model="env.value" 
                      type="text" 
                      placeholder="value"
                      class="env-value"
                    />
                    <button 
                      type="button" 
                      @click="removeEnvVar(index)"
                      class="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                  <button 
                    type="button" 
                    @click="addEnvVar"
                    class="add-env-btn"
                  >
                    Add Variable
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="jobAgent">Select Agent</label>
                <select id="jobAgent" v-model="newJob.agentId" required>
                  <option value="">Choose an agent</option>
                  <option 
                    v-for="agent in onlineAgents" 
                    :key="agent.id"
                    :value="agent.id"
                  >
                    {{ agent.hostname }} ({{ agent.os }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="jobTags">Tags (Optional)</label>
                <input 
                  id="jobTags"
                  v-model="newJob.tagsInput" 
                  type="text" 
                  placeholder="gpu, us-east, production (comma separated)"
                />
              </div>

              <div class="form-group">
                <label for="jobCron">Schedule (Optional)</label>
                <select id="jobCron" v-model="newJob.cron">
                  <option value="">Run once (immediate)</option>
                  <option value="@daily">Daily</option>
                  <option value="@weekly">Weekly</option>
                  <option value="@monthly">Monthly</option>
                  <option value="0 */6 * * *">Every 6 hours</option>
                  <option value="0 0 * * 0">Weekly (Sunday)</option>
                </select>
              </div>

              <div class="modal-actions">
                <button type="button" @click="closeModal" class="btn-secondary">
                  Cancel
                </button>
                <button type="submit" class="btn-primary" :disabled="isCreatingJob">
                  <span v-if="isCreatingJob" class="loading-spinner"></span>
                  {{ isCreatingJob ? 'Creating...' : 'Create Job' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { agentAPI, jobAPI, dashboardAPI, type Agent, type Job, type CreateJobRequest } from '../services/api';

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

// Reactive data
const agentToken = ref('');
const tokenCopied = ref(false);
const commandCopied = ref(false);
const selectedOS = ref('linux');
const showNewJobModal = ref(false);
const isCreatingJob = ref(false);
const loading = ref(false);

// Data arrays
const agents = ref<Agent[]>([]);
const jobs = ref<Job[]>([]);

const newJob = ref({
  name: '',
  script: '',
  env: [{ key: '', value: '' }],
  agentId: '',
  tagsInput: '',
  cron: ''
});

// OS tabs for installation commands
const osTabs = [
  { id: 'linux', name: 'Linux' },
  { id: 'macos', name: 'macOS' },
  { id: 'windows', name: 'Windows/WSL' }
];

// Computed properties
const hasConnectedAgents = computed(() => 
  agents.value.some(agent => agent.status === 'online')
);

const onlineAgents = computed(() => 
  agents.value.filter(agent => agent.status === 'online')
);

// Methods
const handleLogout = () => {
  authStore.logout();
  toastStore.showInfo('You have been logged out');
  router.push('/auth');
  console.log("Route changed")
};

const copyToken = async () => {
  try {
    await navigator.clipboard.writeText(agentToken.value);
    tokenCopied.value = true;
    toastStore.showSuccess('Agent token copied to clipboard');
    setTimeout(() => tokenCopied.value = false, 2000);
  } catch (error) {
    toastStore.showError('Failed to copy token');
  }
};

const copyCommand = async () => {
  try {
    await navigator.clipboard.writeText(getInstallCommand());
    commandCopied.value = true;
    toastStore.showSuccess('Command copied to clipboard');
    setTimeout(() => commandCopied.value = false, 2000);
  } catch (error) {
    toastStore.showError('Failed to copy command');
  }
};

const getInstallCommand = () => {
  const baseCommand = `npx devfleet-agent --token ${agentToken.value} --server https://devfleet.io`;
  
  switch (selectedOS.value) {
    case 'windows':
      return `# For Windows/WSL\n${baseCommand}`;
    case 'macos':
      return `# For macOS\n${baseCommand}`;
    default:
      return `# For Linux\n${baseCommand}`;
  }
};

// API functions
const fetchAgentToken = async () => {
  try {
    const response = await dashboardAPI.getAgentToken();
    agentToken.value = response.data.token;
  } catch (error: any) {
    console.error('Failed to fetch agent token:', error);
    // Fallback to a demo token for development
    agentToken.value = 'devfleet_agt_demo_token_12345';
  }
};

const fetchAgents = async () => {
  try {
    loading.value = true;
    const response = await agentAPI.getAgents();
    agents.value = response.data.map(agent => ({
      ...agent,
      lastSeen: new Date(agent.lastSeen)
    }));
  } catch (error: any) {
    console.error('Failed to fetch agents:', error);
    toastStore.showError('Failed to load agents');
    // Use mock data for development
    agents.value = [
      {
        id: 'agent-1',
        hostname: 'my-server-01',
        os: 'Ubuntu 22.04',
        status: 'online' as const,
        lastSeen: new Date(),
        concurrency: 4,
        tags: ['gpu', 'us-east']
      }
    ];
  } finally {
    loading.value = false;
  }
};

const fetchJobs = async () => {
  try {
    const response = await jobAPI.getJobs(10, 0);
    jobs.value = response.data.map(job => ({
      ...job,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt)
    }));
  } catch (error: any) {
    console.error('Failed to fetch jobs:', error);
    toastStore.showError('Failed to load jobs');
    // Use mock data for development
    jobs.value = [
      {
        id: 'job-1',
        name: 'Daily Backup',
        description: 'Backup important files to S3',
        script: '#!/bin/bash\necho "Running backup..."',
        status: 'completed' as const,
        agentId: 'agent-1',
        tags: ['backup'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60)
      }
    ];
  }
};

const refreshAgents = async () => {
  toastStore.showInfo('Refreshing agents...');
  await fetchAgents();
};

const tagAgent = async (agent: Agent) => {
  const newTags = prompt(`Enter tags for ${agent.hostname} (comma separated):`, agent.tags.join(', '));
  if (newTags !== null) {
    try {
      const tags = newTags.split(',').map(tag => tag.trim()).filter(Boolean);
      await agentAPI.tagAgent(agent.id, tags);
      toastStore.showSuccess(`Tagged agent ${agent.hostname}`);
      await fetchAgents();
    } catch (error: any) {
      console.error('Failed to tag agent:', error);
      toastStore.showError('Failed to tag agent');
    }
  }
};

const disconnectAgent = async (agent: Agent) => {
  if (confirm(`Are you sure you want to disconnect ${agent.hostname}?`)) {
    try {
      await agentAPI.disconnectAgent(agent.id);
      toastStore.showSuccess(`Disconnected agent ${agent.hostname}`);
      await fetchAgents();
    } catch (error: any) {
      console.error('Failed to disconnect agent:', error);
      toastStore.showError('Failed to disconnect agent');
    }
  }
};

const addEnvVar = () => {
  newJob.value.env.push({ key: '', value: '' });
};

const removeEnvVar = (index: number) => {
  newJob.value.env.splice(index, 1);
  if (newJob.value.env.length === 0) {
    newJob.value.env.push({ key: '', value: '' });
  }
};

const handleScriptUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      newJob.value.script = content;
      toastStore.showSuccess(`Script loaded from ${file.name}`);
    };
    reader.readAsText(file);
  }
};

const closeModal = () => {
  showNewJobModal.value = false;
  // Reset form
  newJob.value = {
    name: '',
    script: '',
    env: [{ key: '', value: '' }],
    agentId: '',
    tagsInput: '',
      cron: ''
  };
  // Reset file input
  const fileInput = document.querySelector('.file-input') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};

const createJob = async () => {
  isCreatingJob.value = true;
  
  try {
    // Prepare job data for API
    const jobData: CreateJobRequest = {
      name: newJob.value.name,
      script: newJob.value.script,
      agentId: newJob.value.agentId || undefined,
      env: newJob.value.env.reduce((acc, env) => {
        if (env.key && env.value) {
          acc[env.key] = env.value;
        }
        return acc;
      }, {} as Record<string, string>),
      tags: newJob.value.tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
      cron: newJob.value.cron || undefined
    };
    
    // Create job via API
    await jobAPI.createJob(jobData);
    
    toastStore.showSuccess(`Job "${newJob.value.name}" created successfully!`);
    closeModal();
    
    // Refresh jobs list
    await fetchJobs();
    
  } catch (error: any) {
    console.error('Failed to create job:', error);
    toastStore.showError(error.response?.data?.message || 'Failed to create job');
  } finally {
    isCreatingJob.value = false;
  }
};

const formatLastSeen = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getAgentName = (agentId: string) => {
  const agent = agents.value.find(a => a.id === agentId);
  return agent ? agent.hostname : 'Unknown Agent';
};

// Lifecycle
onMounted(async () => {
  // Initialize dashboard data
  await Promise.all([
    fetchAgentToken(),
    fetchAgents(),
    fetchJobs()
  ]);
});
</script>

<style scoped>
/* Dashboard Layout */
.dashboard {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background: var(--surface-primary);
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-primary);
}

.dashboard-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin: 0;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu span {
  font-size: 1rem;
  color: var(--text-tertiary);
}

.logout-btn {
  background: var(--surface-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.logout-btn:hover {
  background: var(--surface-tertiary);
  border-color: var(--border-secondary);
}

.dashboard-main {
  flex: 1;
  padding: 2rem;
  background: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Onboarding Section */
.onboarding-section {
  background: var(--surface-primary);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-primary);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.welcome-card h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.welcome-card p {
  font-size: 1.2rem;
  color: var(--text-tertiary);
  margin-bottom: 2rem;
}

.setup-wizard {
  margin-top: 2rem;
}

.wizard-step {
  background: var(--surface-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  margin-bottom: 1rem;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--accent-primary);
  color: var(--text-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  margin-right: 1rem;
}

.step-content h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.step-content p {
  font-size: 1rem;
  color: var(--text-tertiary);
  margin: 0;
}

.token-section {
  margin-top: 1rem;
}

.token-display,
.command-display {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.token-display code,
.command-display code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--text-secondary);
  flex: 1;
  word-break: break-all;
}

.copy-btn {
  background: var(--surface-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-secondary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.copy-btn:hover {
  background: var(--surface-quaternary);
  border-color: var(--border-tertiary);
}

.copy-btn.copied {
  background: var(--accent-success);
  color: var(--text-primary);
  border-color: var(--accent-success);
}

.command-section {
  margin-top: 1rem;
}

.os-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.os-tab {
  background: var(--surface-secondary);
  color: var(--text-tertiary);
  border: 1px solid var(--border-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.os-tab:hover {
  background: var(--surface-tertiary);
  color: var(--text-secondary);
}

.os-tab.active {
  background: var(--accent-primary);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}

.connection-status {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-tertiary);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-primary);
  border-top: 2px solid var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.refresh-btn {
  background: var(--surface-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  align-self: flex-start;
}

.refresh-btn:hover {
  background: var(--accent-primary);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}

/* Main Dashboard */
.main-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-actions {
  display: flex;
  justify-content: flex-start;
}

.btn-primary {
  background: var(--accent-primary);
  color: var(--text-primary);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
}

.btn-secondary {
  background: var(--surface-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--surface-tertiary);
  border-color: var(--border-secondary);
}

/* Agents Section */
.agents-section {
  background: var(--surface-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
}

.agents-section h3 {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.agents-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.agent-card {
  background: var(--surface-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.agent-card:hover {
  border-color: var(--border-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.agent-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.agent-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.online {
  background: var(--accent-success);
  box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
}

.status-indicator.offline {
  background: var(--accent-error);
}

.hostname {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
}

.agent-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  background: var(--surface-tertiary);
  color: var(--text-muted);
  border: 1px solid var(--border-primary);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: var(--surface-quaternary);
  color: var(--text-secondary);
}

.action-btn.danger:hover {
  background: var(--accent-error);
  color: var(--text-primary);
  border-color: var(--accent-error);
}

.agent-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item .label {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.detail-item .value {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.agent-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  border: 1px solid var(--border-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag:hover {
  background: var(--surface-tertiary);
  color: var(--text-secondary);
}

/* Jobs Section */
.jobs-section {
  background: var(--surface-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
}

.jobs-section h3 {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.job-item {
  background: var(--surface-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.job-item:hover {
  border-color: var(--border-secondary);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.job-header h4 {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.job-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.job-status.running {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.job-status.completed {
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-success);
}

.job-status.failed {
  background: rgba(239, 68, 68, 0.1);
  color: var(--accent-error);
}

.job-status.scheduled {
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-warning);
}

.job-description {
  color: var(--text-tertiary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.job-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-muted);
  font-size: 0.75rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--surface-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-primary);
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--text-secondary);
  background: var(--surface-secondary);
}

.modal-content {
  padding: 0 1.5rem;
}

.modal-footer {
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  border-top: 1px solid var(--border-primary);
  margin-top: 1.5rem;
}

/* Form Elements */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: var(--surface-secondary);
  color: var(--text-primary);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--focus-ring);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* Environment Variables */
.env-vars {
  margin: 1rem 0;
}

.env-var-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.env-var-item input {
  flex: 1;
}

.remove-env-var {
  background: none;
  border: 1px solid var(--accent-error);
  color: var(--accent-error);
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-env-var:hover {
  background: var(--accent-error);
  color: var(--text-primary);
}

.add-env-var {
  background: none;
  border: 1px dashed var(--border-secondary);
  color: var(--text-tertiary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.2s ease;
}

.add-env-var:hover {
  border-color: var(--accent-primary);
  color: var(--text-secondary);
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-tertiary);
}

.empty-state h4 {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  color: var(--text-secondary);
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

/* Loading States */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-tertiary);
}

.loading::after {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-primary);
  border-top: 2px solid var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-header .container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .dashboard-main {
    padding: 1rem;
  }

  .agents-grid {
    grid-template-columns: 1fr;
  }

  .agent-details {
    grid-template-columns: 1fr 1fr;
  }

  .modal {
    width: 95%;
    margin: 1rem;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 1rem;
  }

  .env-var-item {
    flex-direction: column;
    align-items: stretch;
  }

  .job-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .job-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
