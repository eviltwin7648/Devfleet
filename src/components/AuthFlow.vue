<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Email Step -->
      <div v-if="authStore.currentStep === 'email'" class="auth-step">
        <div class="auth-header">
          <h2>Welcome to DevFleet</h2>
          <p>Enter your email to get started</p>
        </div>

        <form @submit.prevent="handleSendOTP" class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              v-model="emailForm.email"
              type="email"
              placeholder="Enter your email"
              :disabled="authStore.isLoading"
              autocomplete="email"
              tabindex="0"
              required
            />
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="authStore.isLoading || !emailForm.email"
          >
            <span v-if="authStore.isLoading" class="loading-spinner"></span>
            {{ authStore.isLoading ? "Sending..." : "Send OTP" }}
          </button>
        </form>

        <div class="or-divider">
          <span>or</span>
        </div>

        <button
          @click="handleGitHubAuth"
          class="btn-github"
          :disabled="authStore.isLoading"
        >
          <svg class="github-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>

        <div class="auth-footer">
          <p>
            Already have an account?
            <button @click="authStore.switchToLogin" class="link-button">
              Sign in
            </button>
          </p>
        </div>
      </div>

      <!-- OTP Verification Step -->
      <div v-else-if="authStore.currentStep === 'otp'" class="auth-step">
        <div class="auth-header">
          <h2>Verify Your Email</h2>
          <p>
            We've sent a verification code to
            <strong>{{ authStore.email }}</strong>
          </p>
        </div>

        <form @submit.prevent="handleVerifyOTP" class="auth-form">
          <div class="form-group">
            <label for="otp">Verification Code</label>
            <input
              id="otp"
              v-model="otpForm.otp"
              type="text"
              placeholder="Enter 6-digit code"
              maxlength="6"
              :disabled="authStore.isLoading"
              autocomplete="one-time-code"
              tabindex="0"
              required
            />
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="authStore.isLoading || otpForm.otp.length !== 6"
          >
            <span v-if="authStore.isLoading" class="loading-spinner"></span>
            {{ authStore.isLoading ? "Verifying..." : "Verify OTP" }}
          </button>
        </form>

        <div class="auth-footer">
          <button @click="handleResendOTP" class="link-button">
            Didn't receive the code? Resend
          </button>
        </div>
      </div>

      <!-- Registration Step -->
      <div v-else-if="authStore.currentStep === 'register'" class="auth-step">
        <div class="auth-header">
          <h2>Complete Your Profile</h2>
          <p>Almost done! Please provide your details</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model="registerForm.name"
              type="text"
              placeholder="Enter your full name"
              :disabled="authStore.isLoading"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="registerForm.password"
              type="password"
              placeholder="Create a strong password"
              :disabled="authStore.isLoading"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              :disabled="authStore.isLoading"
              required
            />
            <div
              v-if="
                registerForm.password &&
                registerForm.confirmPassword &&
                registerForm.password !== registerForm.confirmPassword
              "
              class="error-message"
            >
              Passwords don't match
            </div>
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="authStore.isLoading || !isRegisterFormValid"
          >
            <span v-if="authStore.isLoading" class="loading-spinner"></span>
            {{ authStore.isLoading ? "Creating Account..." : "Create Account" }}
          </button>
        </form>
      </div>

      <!-- Login Step -->
      <div v-else-if="authStore.currentStep === 'login'" class="auth-step">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="loginEmail">Email Address</label>
            <input
              id="loginEmail"
              v-model="loginForm.email"
              type="email"
              placeholder="Enter your email"
              :disabled="authStore.isLoading"
              required
            />
          </div>

          <div class="form-group">
            <label for="loginPassword">Password</label>
            <input
              id="loginPassword"
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
              :disabled="authStore.isLoading"
              required
            />
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="
              authStore.isLoading || !loginForm.email || !loginForm.password
            "
          >
            <span v-if="authStore.isLoading" class="loading-spinner"></span>
            {{ authStore.isLoading ? "Signing In..." : "Sign In" }}
          </button>
        </form>

        <div class="or-divider">
          <span>or</span>
        </div>

        <button
          @click="handleGitHubAuth"
          class="btn-github"
          :disabled="authStore.isLoading"
        >
          <svg class="github-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <button @click="authStore.switchToSignup" class="link-button">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useToastStore } from "../stores/toast";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toastStore = useToastStore();

// Check for GitHub OAuth errors on mount
onMounted(() => {
  const error = route.query.error as string;
  if (error) {
    toastStore.showError(decodeURIComponent(error));
    // Clean up the URL
    router.replace({ path: route.path });
  }
});

// Form data
const emailForm = ref({
  email: "",
});

const otpForm = ref({
  otp: "",
});

const registerForm = ref({
  name: "",
  password: "",
  confirmPassword: "",
});

const loginForm = ref({
  email: "",
  password: "",
});

// Computed
const isRegisterFormValid = computed(() => {
  return (
    registerForm.value.name &&
    registerForm.value.password &&
    registerForm.value.confirmPassword &&
    registerForm.value.password === registerForm.value.confirmPassword &&
    registerForm.value.password.length >= 6
  );
});

// Methods
const handleSendOTP = async () => {
  const result = await authStore.sendOTP(emailForm.value.email);
  if (result.success) {
    toastStore.showSuccess(result.message);
  } else {
    toastStore.showError(result.message);
  }
};

const handleVerifyOTP = async () => {
  const result = await authStore.verifyOTP(otpForm.value.otp);
  if (result.success) {
    toastStore.showSuccess(result.message);
  } else {
    toastStore.showError(result.message);
  }
};

const handleResendOTP = async () => {
  const result = await authStore.sendOTP(authStore.email);
  if (result.success) {
    toastStore.showSuccess(result.message);
  } else {
    toastStore.showError(result.message);
  }
  otpForm.value.otp = "";
};

const handleRegister = async () => {
  if (!isRegisterFormValid.value) return;

  const result = await authStore.register(
    registerForm.value.name,
    registerForm.value.password,
    registerForm.value.confirmPassword
  );
  if (result.success) {
    toastStore.showSuccess(result.message);
    router.push("/dashboard");
  } else {
    toastStore.showError(result.message);
  }
};

const handleLogin = async () => {
  const result = await authStore.login(
    loginForm.value.email,
    loginForm.value.password
  );
  if (result.success) {
    toastStore.showSuccess(result.message);
    router.push("/dashboard");
  } else {
    toastStore.showError(result.message);
    
    // If the error mentions GitHub, suggest using GitHub login
    if (result.message.includes('GitHub')) {
      setTimeout(() => {
        toastStore.showInfo('Try using the "Continue with GitHub" button instead');
      }, 2000);
    }
  }
};

const handleGitHubAuth = () => {
  authStore.loginWithGitHub();
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);
  padding: 2rem;
  margin: 0;
}

.auth-card {
  background: var(--surface-primary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  min-width: 400px;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.auth-step {
  padding: 3rem 2.5rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

.auth-header p {
  color: var(--text-tertiary);
  font-size: 1rem;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.95rem;
  letter-spacing: 0.01em;
}

.form-group input {
  padding: 1rem 1.25rem;
  border: 1.5px solid var(--border-primary);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: var(--surface-secondary);
  color: var(--text-primary);
  font-family: inherit;
  z-index: 10;
  pointer-events: auto;
  position: relative;
  width: 100%;
  display: block;
}

.form-group input::placeholder {
  color: var(--text-muted);
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-primary);
  background-color: var(--surface-secondary);
  box-shadow: 0 0 0 3px var(--focus-ring);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--bg-tertiary);
}

.error-message {
  color: var(--accent-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.btn-primary {
  background: var(--accent-primary);
  color: var(--text-primary);
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 52px;
  letter-spacing: 0.025em;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(74, 158, 255, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: var(--bg-quaternary);
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-primary);
}

.auth-footer p {
  color: var(--text-tertiary);
  font-size: 0.95rem;
}

.link-button {
  background: none;
  border: none;
  color: var(--accent-primary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  font-size: inherit;
  transition: color 0.2s ease;
}

.link-button:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.or-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.or-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-primary);
}

.or-divider span {
  background: var(--surface-primary);
  color: var(--text-tertiary);
  padding: 0 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-github {
  background: var(--surface-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 52px;
  letter-spacing: 0.025em;
  width: 100%;
}

.btn-github:hover:not(:disabled) {
  background: var(--surface-tertiary);
  border-color: var(--border-secondary);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.btn-github:active:not(:disabled) {
  transform: translateY(0);
}

.btn-github:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.github-icon {
  flex-shrink: 0;
}

/* Desktop optimized responsive design */
@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }

  .auth-card {
    min-width: 320px;
    max-width: 100%;
  }

  .auth-step {
    padding: 2rem 1.5rem;
  }

  .auth-header h2 {
    font-size: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .auth-card {
    max-width: 520px;
  }

  .auth-step {
    padding: 3.5rem 3rem;
  }
}
</style>
