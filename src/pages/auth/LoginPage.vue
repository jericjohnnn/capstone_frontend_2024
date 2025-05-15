<template>
  <NavBar />
  <div class="min-h-[calc(100vh-5rem)] flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8">
    <NotificationToast
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
    />
    <div
      class="flex bg-white w-full shadow-md rounded-lg flex-col justify-center items-center
             p-6 sm:p-8 tablet:p-12 lg:p-16
             mx-4 sm:mx-auto
             min-h-[calc(100vh-5rem)] tablet:min-h-0
             sm:w-11/12 tablet:w-8/12 lg:w-6/12 xl:w-5/12
             space-y-6"
    >
      <div class="w-full max-w-md">
        <h2 class="text-center text-2xl sm:text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div class="w-full max-w-md">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <label for="email" class="block text-sm sm:text-base font-medium text-gray-900">
              Email address
            </label>
            <div>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="Email"
                required
                class="block w-full rounded-lg px-3 py-2.5 sm:py-3 text-gray-900 border border-gray-300
                       placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                       text-sm sm:text-base transition-colors duration-200"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm sm:text-base font-medium text-gray-900">
                Password
              </label>
              <router-link to="/forgot-password" class="text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Forgot password?
              </router-link>
            </div>
            <div>
              <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                placeholder="Password"
                required
                class="block w-full rounded-lg px-3 py-2.5 sm:py-3 text-gray-900 border border-gray-300
                       placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                       text-sm sm:text-base transition-colors duration-200"
              />
            </div>
          </div>

          <div class="space-y-4 pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2.5 sm:py-3
                     text-sm sm:text-base font-semibold text-white shadow-sm
                     hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
                     disabled:opacity-70 disabled:cursor-not-allowed
                     transition-all duration-200"
            >
              <span>Sign in</span>
            </button>

            <p class="text-center text-sm sm:text-base text-gray-500">
              Not yet registered?
              <a
                href="/register"
                class="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
  <FooterSection />
</template>

<script setup>
import FooterSection from '@/sections/FooterSection.vue'
import NavBar from '@/sections/NavBar.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import NotificationToast from '@/components/Reusables/NotificationToast.vue'
import { useNotification } from '@/composables/useNotification'

const email = ref('')
const password = ref('')
const router = useRouter()
const { notification, showNotification } = useNotification()
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true

  try {
    const response = await axiosInstance.post('api/login', {
      email: email.value,
      password: password.value,
    })

    const { user_id, user_email, user_full_name, user_type, user_data, token } =
      response.data

    localStorage.setItem('app_auth_token', token)
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('user_type', user_type)
    localStorage.setItem('user_email', user_email)
    localStorage.setItem('user_full_name', user_full_name)
    localStorage.setItem('user_data', JSON.stringify(user_data))

    showNotification('Login successful!', 'success')

    setTimeout(() => {
      if (user_type === 'Tutor') {
        if (user_data.approval_status === 'Pending') {
          router.push('/tutor/pending-approval')
        } else {
          router.push('/tutor/profile')
        }
      }
      if (user_type === 'Student') {
        router.push('/student/home')
      }
    }, 1500)
  } catch (error) {
    console.error('Login error:', error)
    showNotification(
      error.response?.data?.message || 'Server is down. No credits left to host :(',
      'error',
    )
  } finally {
    isLoading.value = false
  }
}
</script>
