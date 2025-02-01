<template>
  <div class="mb-6">
    <NotificationToast
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
    />

    <div class="flex justify-between items-center mb-3">
      <h3 class="font-medium">Tutor Links</h3>
      <button
        @click="toggleEditMode"
        class="text-blue-600 text-sm hover:text-blue-700 transition-colors"
      >
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>

    <!-- Display Mode -->
    <div v-if="!isEditing" class="px-2">
      <p class="text-blue-600 text-sm font-medium">
        <span class="text-black">Google meet</span> - {{ userData.gmeet_link }}
      </p>
      <p class="text-blue-600 text-sm font-medium">
        <span class="text-black">Zoom</span> - {{ userData.zoom_link }}
      </p>
      <p class="text-blue-600 text-sm font-medium">
        <span class="text-black">Skype</span> - {{ userData.skype_link }}
      </p>
    </div>

    <!-- Edit Mode -->
    <div v-else class="space-y-3">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <div class="relative">
            <p class="text-xs text-gray-500 mt-1">Google meet</p>
            <input
              type="text"
              v-model="gMeetLink"
              class="w-full pr-3 py-1.5 border rounded text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Enter Google meet link"
            />
            <p class="text-xs text-gray-500 mt-1">Zoom</p>
            <input
              type="text"
              v-model="zoomLink"
              class="w-full pr-3 py-1.5 border rounded text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Enter Zoom link"
            />
            <p class="text-xs text-gray-500 mt-1">Skype</p>
            <input
              type="text"
              v-model="skypeLink"
              class="w-full pr-3 py-1.5 border rounded text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Enter Skype link"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button
          @click="saveTutorLinks"
          class="w-full sm:w-auto px-6 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axiosInstance from '@/axiosInstance'
import { getUserData } from '@/utils/user'
import NotificationToast from '@/components/Reusables/NotificationToast.vue'
import { useNotification } from '@/composables/useNotification'

const userData = getUserData()
const gMeetLink = ref(userData.value.gmeet_link || '')
const zoomLink = ref(userData.value.zoom_link || '')
const skypeLink = ref(userData.value.skype_link || '')
const isEditing = ref(false)
const { notification, showNotification } = useNotification()

const saveTutorLinks = async () => {
  try {

    const data = {
      gmeet_link: gMeetLink.value,
      zoom_link: zoomLink.value,
      skype_link: skypeLink.value
    };

    await axiosInstance.post('/api/edit-details', data)

    userData.value.gmeet_link = data.gmeet_link
    userData.value.zoom_link = data.zoom_link
    userData.value.skype_link = data.skype_link
    localStorage.setItem('user_data', JSON.stringify(userData.value))
    showNotification('Tutor links updated successfully!')
    isEditing.value = false
  } catch (error) {
    console.error('Error saving tutor links:', error)
    showNotification(
      error.response?.data?.message || 'Failed to update tutor links',
      'error',
    )
  }
}

const toggleEditMode = () => {
  if (isEditing.value) {
    gMeetLink.value = userData.value.gmeet_link
    zoomLink.value = userData.value.zoom_link
    skypeLink.value = userData.value.skype_link
  }
  isEditing.value = !isEditing.value
}
</script>
