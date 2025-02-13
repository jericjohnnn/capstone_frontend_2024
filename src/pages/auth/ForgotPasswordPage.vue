<script setup>
import { ref } from "vue";
import axiosInstance from "@/axiosInstance";
import ResetPassword from "@/components/ResetPassword.vue";
import NavBar from '@/sections/NavBar.vue';
import FooterSection from '@/sections/FooterSection.vue';

const email = ref("");
const message = ref("");
const error = ref("");
const loading = ref(false);
const showOTPInput = ref(false);
const showResetPassword = ref(false);
const otp = ref("");

const requestOTP = async () => {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const response = await axiosInstance.post("api/forgot-password", { email: email.value });
    message.value = response.data.message;
    showOTPInput.value = true;
  } catch (err) {
    error.value = err.response?.data?.error || "Something went wrong";
  } finally {
    loading.value = false;
  }
};

const verifyOTP = async () => {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const response = await axiosInstance.post("api/verify-otp", {
      email: email.value,
      otp: otp.value
    });
    message.value = response.data.message;
    showResetPassword.value = true; // Show reset password component after OTP verification
  } catch (err) {
    error.value = err.response?.data?.error || "Something went wrong";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <NavBar />
  <div class="min-h-[calc(100vh-5rem)] flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8">
    <div class="flex bg-white w-full shadow-md rounded-lg flex-col justify-center items-center
                p-6 sm:p-8 tablet:p-12 lg:p-16
                mx-4 sm:mx-auto
                min-h-[calc(100vh-5rem)] tablet:min-h-0
                sm:w-11/12 tablet:w-8/12 lg:w-6/12 xl:w-5/12
                space-y-6">
      <div v-if="!showResetPassword" class="w-full max-w-md">
        <h2 class="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Forgot Password</h2>

        <!-- Email input section -->
        <div v-show="!showOTPInput" class="space-y-6">
          <div class="space-y-2">
            <label for="email" class="block text-sm sm:text-base font-medium text-gray-900">
              Email address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="block w-full rounded-lg px-3 py-2.5 sm:py-3 text-gray-900 border border-gray-300
                     placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                     text-sm sm:text-base transition-colors duration-200"
              required
            />
          </div>

          <button
            @click="requestOTP"
            :disabled="loading"
            class="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2.5 sm:py-3
                   text-sm sm:text-base font-semibold text-white shadow-sm
                   hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
                   disabled:opacity-70 disabled:cursor-not-allowed
                   transition-all duration-200"
          >
            {{ loading ? "Sending..." : "Send OTP" }}
          </button>
        </div>

        <!-- OTP input section -->
        <div v-show="showOTPInput" class="space-y-6">
          <div class="space-y-2">
            <label for="otp" class="block text-sm sm:text-base font-medium text-gray-900">
              Enter OTP
            </label>
            <input
              id="otp"
              v-model="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              maxlength="6"
              class="block w-full rounded-lg px-3 py-2.5 sm:py-3 text-gray-900 border border-gray-300
                     placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                     text-sm sm:text-base transition-colors duration-200"
              required
            />
          </div>

          <button
            @click="verifyOTP"
            :disabled="loading"
            class="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2.5 sm:py-3
                   text-sm sm:text-base font-semibold text-white shadow-sm
                   hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
                   disabled:opacity-70 disabled:cursor-not-allowed
                   transition-all duration-200"
          >
            {{ loading ? "Verifying..." : "Verify OTP" }}
          </button>
        </div>

        <div class="mt-4">
          <p v-if="message" class="text-green-500 text-center">{{ message }}</p>
          <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
        </div>
      </div>

      <!-- Reset Password Component -->
      <ResetPassword v-else :email="email" />
    </div>
  </div>
  <FooterSection />
</template>
