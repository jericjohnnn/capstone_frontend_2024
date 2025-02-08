<template>
  <div class="w-full mx-auto">
    <div class="flex flex-col md:flex-row gap-3">
      <!-- Tutor Search -->
      <div class="flex-1">
        <div class="relative">
          <input
            type="text"
            v-model="tutor"
            placeholder="Search for a tutor"
            class="w-full px-4 py-2.5 pl-10 text-sm rounded-md border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="size-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Subject Search -->
      <div class="flex-1">
        <div class="relative">
          <input
            type="text"
            v-model="subject"
            placeholder="Search for a subject"
            class="w-full px-4 py-2.5 pl-10 text-sm rounded-md border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="size-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Search Button -->
      <div class="md:w-32">
        <button
          type="button"
          @click="handleSearchAction"
          class="w-full px-4 py-2.5 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          <svg
            class="shrink-0 size-4 text-slate-50"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          Search
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axiosInstance from '@/axiosInstance';

const props = defineProps({
  selectedSubject: {
    type: String,
    default: null
  }
})

watch(() => props.selectedSubject, (newVal) => {
  if (newVal) {
    subject.value = newVal
    handleSearchAction()
  }
})

const tutor = ref('');
const subject = ref('');

const emit = defineEmits(['update:search-results', 'reset-search-results']);

const handleSearchAction = async () => {
  if (tutor.value === '' && subject.value === '') {
    emit('reset-search-results')
    return;
  }

  try {
    // Update the URL without navigation
    const params = new URLSearchParams();
    if (tutor.value) params.append('tutor', tutor.value);
    if (subject.value) params.append('subject', subject.value);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, '', newUrl);

    const response = await axiosInstance.get('/api/search-tutor', {
      params: {
        tutor: tutor.value,
        subject: subject.value,
      },
    });

    emit('update:search-results', response.data)
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Search request failed:', error);
  }
};

</script>


