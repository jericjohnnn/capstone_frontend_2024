<script setup>
import { ref } from "vue";
import axiosInstance from "@/axiosInstance";

// Define props
const props = defineProps({
  email: {
    type: String,
    required: true
  }
});

const password = ref("");
const password_confirmation = ref("");
const message = ref("");
const error = ref("");
const loading = ref(false);

const resetPassword = async () => {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const response = await axiosInstance.post("api/reset-password", {
      email: props.email,
      password: password.value,
      password_confirmation: password_confirmation.value
    });

    message.value = response.data.message;
  } catch (err) {
    error.value = err.response?.data?.error || "Something went wrong";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-md">
    <h2 class="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Reset Password</h2>

    <form class="space-y-6" @submit.prevent="resetPassword">
      <div class="space-y-2">
        <label for="password" class="block text-sm sm:text-base font-medium text-gray-900">
          New Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter new password"
          class="block w-full rounded-lg px-3 py-2.5 sm:py-3 text-gray-900 border border-gray-300
                 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                 text-sm sm:text-base transition-colors duration-200"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="password_confirmation" class="block text-sm sm:text-base font-medium text-gray-900">
          Confirm Password
        </label>
        <input
          id="password_confirmation"
          v-model="password_confirmation"
          type="password"
          placeholder="Confirm new password"
          class="block w-full rounded-lg px-3 py-2.5 sm:py-3 text-gray-900 border border-gray-300
                 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                 text-sm sm:text-base transition-colors duration-200"
          required
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2.5 sm:py-3
               text-sm sm:text-base font-semibold text-white shadow-sm
               hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
               disabled:opacity-70 disabled:cursor-not-allowed
               transition-all duration-200"
      >
        {{ loading ? "Resetting..." : "Reset Password" }}
      </button>

      <div class="mt-4">
        <p v-if="message" class="text-green-500 text-center">{{ message }}</p>
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      </div>
    </form>
  </div>
</template>
