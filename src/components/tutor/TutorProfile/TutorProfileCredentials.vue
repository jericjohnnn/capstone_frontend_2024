<template>
  <div class="space-y-4">
    <NotificationToast
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
    />
    <div class="flex flex-wrap gap-4">
      <!-- Credential Images List -->
      <div
        v-for="(credential, index) in userData.credentials"
        :key="credential.id"
        class="p-4 bg-white border rounded-lg transition-all"
      >
        <!-- Display Credential Images -->
        <div class="flex flex-col items-center gap-2">
          <span class="w-24 h-24 flex items-center justify-center">
            <span v-if="credential.image">
              <Image :src="credential.image" alt="Image" preview />
            </span>
            <span v-else> N/A </span>
          </span>
          <button
            @click="deleteCredential(credential.id, index)"
            class="text-red-600 text-sm hover:text-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add New Credential Button -->
    <button
      @click="openFileSelector"
      class="w-full py-2 px-4 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
    >
      + Add Credentials
    </button>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="addNewCredential"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axiosInstance from '@/axiosInstance'
import { getUserData } from '@/utils/user'
import NotificationToast from '@/components/Reusables/NotificationToast.vue'
import { useNotification } from '@/composables/useNotification'
import Image from 'primevue/image'

const userData = getUserData()
const { notification, showNotification } = useNotification()

const fileInput = ref(null)

const openFileSelector = () => {
  fileInput.value.click()
}

const addNewCredential = async event => {
  const file = event.target.files[0]

  if (!file) {
    return
  }

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await axiosInstance.post('/api/add-credential', formData)
    userData.value.credentials.push(response.data.credential)
    localStorage.setItem('user_data', JSON.stringify(userData.value))
    console.log(response.data.credential)
    showNotification('New credential added successfully!')
  } catch (error) {
    console.error('Failed to add new credential:', error)
    showNotification(
      error.response?.data?.message || 'Failed to add new credential',
      'error',
    )
  }
}

const deleteCredential = async (id, index) => {
  try {
    await axiosInstance.delete(`/api/delete-credential/${id}`)
    userData.value.credentials.splice(index, 1)
    localStorage.setItem('user_data', JSON.stringify(userData.value))
    showNotification('Credential deleted successfully!', 'error')
  } catch (error) {
    console.error('Failed to delete credential:', error)
    showNotification(
      error.response?.data?.message || 'Failed to delete credential',
      'error',
    )
  }
}
</script>
