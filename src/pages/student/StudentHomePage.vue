<template>
  <main class="w-full min-h-screen bg-blue-100">
    <SideBar>
      <!-- Container with gap between grid items -->
      <div
        class="grid grid-cols-1 gap-4 min-h-screen py-5 tablet:grid-rows-[auto,auto,1fr] tablet:grid-flow-col"
      >
        <!-- Breadcrumb Section -->
        <div class="w-full hidden tablet:block tablet:row-span-1">
          <BreadCrumb
            :breadcrumbs="[{ label: 'Home', route: '/student/home' }]"
          />
        </div>

        <!-- Search Section -->
        <div class="w-full pb-4 tablet:pb-10 tablet:row-span-1">
          <TutorSearch
            @update:search-results="updateSearchResults"
          ></TutorSearch>
          <div>
            <AllSubjects></AllSubjects>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="grid grid-cols-1 tablet:grid-cols-9 gap-4 tablet:row-span-1">
          <!-- tablet:max-h-[calc(100vh-14rem)] -->
          <!-- Left Column - Split into two rows -->
          <div class="grid grid-rows-[1fr,auto] gap-4 tablet:col-span-4">
            <!-- Tutor Cards Section -->
            <div class="w-full min-h-96">
              <div
                v-if="tutorsLoading"
                class="flex justify-center items-center h-full"
              >
                <LoaderSpinner />
              </div>
              <div v-else class="space-y-4">
                <TutorCard
                  v-for="tutor in tutors"
                  :key="tutor.id"
                  :tutor="tutor"
                  :loading="tutorsLoading"
                  @triggerSelectTutor="selectTutor(tutor.id)"
                  @triggerSelectTutorMobile="selectTutorMobile(tutor.id)"
                  class="tablet:w-11/12"
                />
              </div>
            </div>

            <!-- Pagination Section -->
            <div class="w-full">
              <PaginationLinks
                :links="paginationLinks"
                :current-page="currentPage"
                :last-page="lastPage"
                class="tablet:w-11/12"
              />
            </div>
          </div>

          <!-- Tutor Details Section -->
          <div
            class="w-full hidden tablet:block tablet:col-span-5 max-h-[calc(100vh-14rem)] xl:max-h-[calc(100vh-14rem)]"
          >
            <div
              v-if="tutorDetailsLoading"
              class="flex justify-center items-center h-full"
            >
              <LoaderSpinner />
            </div>
            <div v-else-if="tutorDetails" class="h-full">
              <TutorDetailsCard :tutor="tutorDetails" class="h-full border" />
            </div>
            <div
              v-else
              class="flex items-center justify-center rounded-sm shadow-sm h-full"
            >
              <p class="text-center text-gray-500">Select a Tutor</p>
            </div>
          </div>
        </div>
      </div>
    </SideBar>

    <FooterSection class="tablet:hidden" />
    <HelpButton></HelpButton>
  </main>
</template>

<script setup>
import FooterSection from '@/sections/FooterSection.vue'
import BreadCrumb from '@/components/BreadCrumb.vue'
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import TutorSearch from '@/components/TutorSearch.vue'
import AllSubjects from '@/components/AllSubjects.vue'
import TutorDetailsCard from '@/components/TutorDetailsCard.vue'
import TutorCard from '@/components/TutorCard.vue'
import PaginationLinks from '@/components/PaginationLinks.vue'
import HelpButton from '@/components/HelpButton.vue'
import axiosInstance from '@/axiosInstance'
import LoaderSpinner from '@/components/Reusables/LoaderSpinner.vue'

const router = useRouter()
const route = useRoute()

const tutors = ref([])
const tutorDetails = ref(null)
const tutorsLoading = ref(false)
const tutorDetailsLoading = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const paginationLinks = ref([])
// Mobile View
const isMobileView = ref(window.innerWidth < 900)

const updateSearchResults = searchedTutors => {
  tutors.value = searchedTutors.data
  currentPage.value = searchedTutors.current_page
  lastPage.value = searchedTutors.last_page
  paginationLinks.value = searchedTutors.links
}

const fetchTutors = async (page = 1) => {
  try {
    tutorsLoading.value = true
    const response = await axiosInstance.get('/api/tutors', {
      params: {
        page,
        number_of_tutors: isMobileView.value ? 20 : 5,
      },
    })
    const { data, current_page, last_page, links } =
      response.data.tutor_previews

    tutors.value = data
    currentPage.value = current_page
    lastPage.value = last_page
    paginationLinks.value = links
  } catch (err) {
    console.error('Error fetching tutors:', err)
  } finally {
    tutorsLoading.value = false
  }
}

const fetchTutorDetails = async tutorId => {
  try {
    tutorDetailsLoading.value = true
    const response = await axiosInstance.get(`/api/tutor-detail/${tutorId}`)
    tutorDetails.value = response.data.tutor
  } catch (err) {
    console.error('Error fetching tutor details:', err)
  } finally {
    tutorDetailsLoading.value = false
  }
}

const selectTutor = tutorId => {
  router.push({
    path: '/student/home',
    query: {
      ...route.query,
      tutor_id: tutorId,
    },
  })
}

const selectTutorMobile = tutorId => {
  router.push({
    path: `/student/tutorProfile/${tutorId}`,
  })
}

watch(
  () => route.query.page,
  (newPage, oldPage) => {
    if (newPage !== oldPage) {
      const page = parseInt(newPage) || 1
      fetchTutors(page)
    }
  },
)

watch(
  () => route.query.tutor_id,
  (newTutorId, oldTutorId) => {
    if (newTutorId !== oldTutorId && newTutorId) {
      fetchTutorDetails(newTutorId)
    }
  },
)

watch(isMobileView, (newIsMobile, oldIsMobile) => {
  if (newIsMobile !== oldIsMobile) {
    fetchTutors()
    router.push({
      query: {
        page: 1,
      },
    });
  }
})

onMounted(() => {
  // window.addEventListener('resize', resizeHandler)
  const initialPage = parseInt(route.query.page) || 1
  fetchTutors(initialPage)
  // Only fetch initial tutor details if tutor_id exists in URL
  const initialTutorId = route.query.tutor_id
  if (initialTutorId) {
    fetchTutorDetails(initialTutorId)
  }
  if (isMobileView.value) {
    router.push({
      query: {
        page: 1,
      },
    });
  }
})
</script>
