<template>
  <div class="mb-2.5">
    <div
      class="bg-blue-50 border border-white shadow-sm rounded-xl hover:shadow-tablet focus:outline-none focus:shadow-tablet transition"
    >
      <!-- Tutor Info Section -->
      <div class="p-3 flex items-center justify-between">
        <div class="flex items-center gap-x-3">
          <div class="shrink-0">
            <img
              class="size-14 rounded-full object-cover border-2 border-gray-100"
              :src="tutor.profile_image || defaultProfileImage"
              :alt="tutor.tutor_name"
            />
          </div>

          <div class="flex flex-col gap-1">
            <h1
              class="text-sm tablet:text-base font-bold text-gray-800 line-clamp-1"
            >
              {{ tutor.tutor_name }}
            </h1>
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-for="(subject, index) in tutor.tutor_subjects"
                :key="index"
                class="inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ subject.abbreviation }}
              </span>
            </div>
          </div>
        </div>
        <!-- Rating and Button -->
        <div class="shrink-0 flex flex-col items-end gap-2">
        <span class="flex gap-2 text-xs underline">
          <StarRating :rating="tutor.tutor_rating" class=""></StarRating>
          {{ tutor.tutor_rating ? Number(tutor.tutor_rating).toFixed(1) : '0.0' }}
        </span>
          <button
            @click="triggerSelectTutor"
            type="button"
            class="hidden tablet:block py-1.5 px-4 text-xs font-medium rounded-tablet border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            View Profile
          </button>
          <button
            @click="triggerSelectTutorMobile"
            type="button"
            class="block tablet:hidden py-1.5 px-3 text-xs font-medium rounded-tablet border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StarRating from '@/components/StarRating.vue'

const defaultProfileImage =
  'data:image/svg+xml;base64,' +
  btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="white" stroke="#E5E7EB" stroke-width="2"/>
    <circle cx="12" cy="8" r="3.5" fill="#9CA3AF"/>
    <path d="M12 12.5c-3 0-5.5 1.5-7 3.5 1.5 3 4 5 7 5s5.5-2 7-5c-1.5-2-4-3.5-7-3.5z" fill="#9CA3AF"/>
  </svg>`)

defineProps({
  tutor: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['triggerSelectTutor', 'triggerSelectTutorMobile'])

const triggerSelectTutor = () => {
  emit('triggerSelectTutor')
}

const triggerSelectTutorMobile = () => {
  emit('triggerSelectTutorMobile')
}
</script>
