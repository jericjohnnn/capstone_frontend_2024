<template>
  <div class="">
    <!-- Loading State -->
    <div
      v-if="!pendingRequests"
      class="min-h-[calc(100vh-20rem)] justify-center flex"
    >
      <div class="flex items-center justify-center">
        <LoaderSpinner />
      </div>
    </div>
    <!-- No Pending Requests Message -->
    <div
      v-else-if="pendingRequests.length === 0"
      class="min-h-[calc(100vh-20rem)] flex items-center justify-center"
    >
      <p class="text-gray-600 text-lg">You haven't sent any request for a tutor session</p>
    </div>
    <!-- Request Cards -->
    <div v-else v-for="book in pendingRequests" :key="book.id" class="mb-3">
      <div
        class="grid grid-rows-[auto,1fr,auto] tablet:grid-cols-3 tablet:grid-rows-1 p-3 gap-2 rounded-xl bg-blue-200 border-blue-50 border-2"
      >
        <div class="flex items-center gap-2">
          <div class="shrink-0">
            <img
              class="shrink-0 size-12 tablet:size-16 rounded-full"
              :src="book.tutor.profile_image || defaultProfileImage"
              alt="profile image"
            />
          </div>
          <div class="flex justify-between w-full tablet:flex-col">
            <h1 class="text-base tablet:text-lg font-medium text-gray-800">
              {{ book.tutor.first_name }} {{ book.tutor.last_name }}
            </h1>
            <button
              @click="selectTutor(book.tutor_id)"
              class="hidden tablet:block w-3/6 py-1.5 px-3 text-xs font-medium rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              View Profile
            </button>
            <p class="tablet:hidden block font-semibold">{{ book.status }}</p>
          </div>
        </div>

        <hr class="block tablet:hidden my-2 border-white" />

        <div
          class="flex justify-between tablet:flex-col items-center order-first tablet:order-none tablet:justify-center"
        >
          <p class="">You requested for</p>
          <div
            class="flex justify-center px-6 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300 mt-1"
          >
            {{ book.subject }}
          </div>
        </div>

        <div
          class="flex justify-between tablet:justify-end gap-3 w-full items-center tablet:col-span-1"
        >
          <p class="hidden tablet:block font-semibold">{{ book.status }}</p>
          <button
            @click="selectTutorMobile(book.tutor_id)"
            class="block tablet:hidden h-full w-full tablet:w-fit py-1.5 px-3 text-xs font-medium rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            View Profile
          </button>
          <button
            @click="goToBookDetails(book.id)"
            type="button"
            class="w-full py-2 px-4 text-sm tablet:text-xs tablet:w-3/6 font-normal rounded-lg border border-blue-400 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
          >
            Review request
          </button>
        </div>
      </div>
    </div>
    <div>
      <PaginationLinks
        :links="paginationLinks"
        :current-page="currentPage"
        :last-page="lastPage"
      />
    </div>
  </div>
</template>

<script setup>
import LoaderSpinner from '@/components/Reusables/LoaderSpinner.vue'
import PaginationLinks from '@/components/PaginationLinks.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'

const router = useRouter()
const route = useRoute()

const defaultProfileImage =
  'data:image/svg+xml;base64,' +
  btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="white" stroke="#E5E7EB" stroke-width="2"/>
    <circle cx="12" cy="8" r="3.5" fill="#9CA3AF"/>
    <path d="M12 12.5c-3 0-5.5 1.5-7 3.5 1.5 3 4 5 7 5s5.5-2 7-5c-1.5-2-4-3.5-7-3.5z" fill="#9CA3AF"/>
  </svg>`)

const pendingRequests = ref(null)
const currentPage = ref(1)
const lastPage = ref(1)
const paginationLinks = ref([])

const fetchSentRequests = async (page = 1) => {
  try {
    const response = await axiosInstance.get(
      `/api/sent-tutor-requests?tab=pending&page=${page}`,
    )
    const { data, current_page, last_page, links } = response.data.sent_requests
    pendingRequests.value = data
    currentPage.value = current_page
    lastPage.value = last_page
    paginationLinks.value = links
  } catch (err) {
    console.error('Error fetching student requests:', err)
  }
}

const selectTutor = tutorId => {
  router.push({
    path: '/student/home',
    query: {
      page: currentPage.value,
      tutor_id: tutorId,
    },
  })
}

const selectTutorMobile = tutorId => {
  router.push({
    path: `/student/tutorProfile/${tutorId}`,
  })
}

const goToBookDetails = bookId => {
  router.push({
    name: 'StudentBookDetails',
    params: { bookId: bookId },
  })
}

watch(
  () => [route.query.tab, route.query.page],
  ([newTab, newPage]) => {
    if (route.query.tab === newTab) {
      fetchSentRequests(newPage)
    }
  },
)

onMounted(() => {
  const initialPage = parseInt(route.query.page) || 1
  fetchSentRequests(initialPage)
})
</script>
