<template>
  <main class="min-h-screen bg-blue-100">
    <NotificationToast
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
    />
    <SideBar>
      <div class="grid grid-cols-1 gap-4 min-h-screen py-5">
        <div class="hidden tablet:block">
          <BreadCrumb
            :breadcrumbs="[
              { label: 'Home', route: '/student/home' },
              { label: 'Book', route: '/student/book/:tutorId' },
            ]"
          />
        </div>
        <div
          class=" grid grid-cols-1 tablet:grid-rows-[auto,auto,1fr] tablet:grid-cols-2 gap-7 tablet:gap-4"
        >
          <div class="tablet:row-span-3">
            <div v-if="!tutorDetails" class="h-full flex justify-center items-center">
              <LoaderSpinner />
            </div>
            <div v-else>
              <TutorAvailability :tutor="tutorDetails" />
              <div>
                <BookCalendar
                  :idToRemove="idToRemove"
                  :tutorBookings="tutorBookings"
                  :tutorWorkDays="tutorWorkDays"
                  :studentBookings="studentBookings"
                  @update:added-schedules="storePendingBookingDates"
                />
              </div>
            </div>
          </div>
          <div v-if="!tutorDetails" class="flex justify-center items-center">
            <LoaderSpinner />
          </div>
          <div v-else class="order-first tablet:-order-none">
            <TutorInfo :tutor="tutorDetails" class="" />
          </div>
          <div
            v-if="!tutorDetails"
            class="min-h-96 flex justify-center items-center"
          >
            <LoaderSpinner />
          </div>
          <div v-else class="tablet:row-span-2 tablet:col-span-1">
            <form @submit.prevent="submitBookingRequest" class="space-y-4">
              <div>
                <SelectedDates
                  :dates="bookingState.selectedDateTimes"
                  @remove-date="removeDate"
                />
              </div>
              <div
                class="space-y-4 tablet:space-y-0 tablet:grid tablet:grid-cols-2 tablet:gap-4"
              >
                <div>
                  <SelectSubject
                    :tutor="tutorDetails"
                    @update:selectedSubject="updateSelectedSubject"
                  />
                </div>
                <div>
                  <SelectLearningPreference
                    @update:learningPreference="updateLearningPreference"
                  />
                </div>
              </div>
              <div>
                <SelectLocationOrPlatform
                  :learningPreference="bookingState.learningPreference"
                  :inSchoolAddress="bookingState.location"
                  @update:videoPlatform="updateVideoPlatform"
                  @update:location="updateLocation"
                />
              </div>
              <div>
                <ChangeContactNumber
                  :contactNumber="bookingState.contactNumber"
                  @update:contactNumber="updateContactNumber"
                />
              </div>
              <div>
                <InputMessage
                  @update:tutorTopic="updateTutorTopic"
                  @update:tutorMessage="updateTutorMessage"
                />
              </div>

              <div class="hidden tablet:flex gap-5">
                <router-link :to="{ name: 'StudentHome' }" class="w-3/6">
                  <button
                    type="button"
                    class="w-full px-4 py-3 text-blue-600 border border-blue-600 rounded-md hover:border-blue-400 hover:text-blue-400 transition"
                  >
                    Cancel
                  </button>
                </router-link>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  BOOK
                </button>
              </div>
            </form>
          </div>
          <!-- STICKY BUTTON -->
          <div
            :class="[
              'z-30 tablet:hidden rounded-xl bottom-0 w-full bg-blue-50 border border-white  px-4 py-3 border-t ',
              { sticky: !isKeyboardVisible },
            ]"
          >
            <div class="flex flex-col justify-center items-center gap-2">
              <div>
                Rate:
                {{
                  tutorDetails
                    ? `₱${tutorDetails.tutor_rate}/Hour`
                    : 'Loading...'
                }}
              </div>
              <button
                :disabled="isLoading"
                @click="submitBookingRequest"
                class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Book
              </button>

              <!-- Report Button -->
              <button
                @click="router.back()"
                class="w-full underline text-gray-500 py-2 text-sm font-medium hover:text-gray-700 transition-colors duration-200 flex items-center justify-center gap-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </SideBar>
    <FooterSection class="block tablet:hidden" />
  </main>
</template>

<script setup>
import SelectedDates from '@/components/student/StudentBookTutor/form/selectedDates.vue'
import FooterSection from '@/sections/FooterSection.vue'
import TutorAvailability from '@/components/student/StudentBookTutor/TutorAvailability.vue'
import ChangeContactNumber from '@/components/student/StudentBookTutor/form/changeContactNumber.vue'
import InputMessage from '@/components/student/StudentBookTutor/form/InputMessage.vue'
import SelectLocationOrPlatform from '@/components/student/StudentBookTutor/form/SelectLocationOrPlatform.vue'
import SelectSubject from '@/components/student/StudentBookTutor/form/SelectSubject.vue'
import SelectLearningPreference from '@/components/student/StudentBookTutor/form/SelectLearningPreference.vue'
import TutorInfo from '@/components/student/StudentBookTutor/TutorInfo.vue'
import BreadCrumb from '@/components/BreadCrumb.vue'
import { ref, reactive, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import BookCalendar from '@/components/shared/calendar/BookCalendar.vue'
import SideBar from '@/components/SideBar.vue'
// import HelpButton from '@/components/HelpButton.vue'
import { getUserData } from '@/utils/user'
import NotificationToast from '@/components/Reusables/NotificationToast.vue'
import { useNotification } from '@/composables/useNotification'
import LoaderSpinner from '@/components/Reusables/LoaderSpinner.vue'

const userData = getUserData()

const tutorBookings = ref([])
const studentBookings = ref([])
const tutorWorkDays = ref({})

const router = useRouter()
const route = useRoute()
const tutorDetails = ref(null)

const updateSelectedSubject = newSubject => {
  bookingState.selectedSubject = newSubject
}

const updateLearningPreference = newPreference => {
  bookingState.learningPreference = newPreference
}

const updateVideoPlatform = newPlatform => {
  bookingState.videoPlatform = newPlatform
}

const updateLocation = newLocation => {
  bookingState.location = newLocation
}

const updateTutorTopic = newTopic => {
  bookingState.tutorTopic = newTopic
}

const updateTutorMessage = newMessage => {
  bookingState.tutorMessage = newMessage
}

const updateContactNumber = newContactNumber => {
  bookingState.contactNumber = newContactNumber
}

const storePendingBookingDates = bookingDates => {
  bookingState.selectedDateTimes = bookingDates
}

const idToRemove = ref('')
const removeDate = dateId => {
  idToRemove.value = dateId
}

const initialBookingState = {
  selectedSubject: '',
  learningPreference: 'In School',
  location: 'CCTC',
  videoPlatform: '',
  contactNumber: userData.value.contact_number || '',
  tutorTopic: '',
  tutorMessage: '',
  selectedDateTimes: [],
}

const bookingState = reactive({ ...initialBookingState })

const { notification, showNotification } = useNotification()

const isLoading = ref(false)
const submitBookingRequest = async () => {
  isLoading.value = true
  const bookRequest = {
    tutor_id: route.params.tutorId,
    student_id: userData.value.id,
    subject: bookingState.selectedSubject,
    learning_mode: bookingState.learningPreference,
    location:
      bookingState.learningPreference === 'Face to Face' ||
      bookingState.learningPreference === 'In School'
        ? bookingState.location
        : null,
    online_meeting_platform:
      bookingState.learningPreference === 'Online'
        ? bookingState.videoPlatform
        : null,
    contact_number: bookingState.contactNumber,
    message_title: bookingState.tutorTopic,
    message_content: bookingState.tutorMessage,
    selected_date_times: bookingState.selectedDateTimes,
  }

  try {
    await axiosInstance.post('api/create-booking', bookRequest)
    showNotification('Booking request submitted successfully!')

    // Add a delay before redirecting
    setTimeout(() => {
      router.push({ name: 'StudentRequests' })
    }, 1500) // Wait 1.5 seconds before redirecting
  } catch (error) {
    console.error('Error submitting form:', error)
    showNotification(
      error.response?.data?.message ||
        'There was an error submitting the form.',
      'error',
    )
  } finally {
    isLoading.value = false
  }
}

const fetchTutorSchedules = async tutorId => {
  try {
    const response = await axiosInstance.get(`/api/tutor-schedules/${tutorId}`)
    const { message, bookings } = response.data

    if (message == 'Tutor not found or has no bookings.') {
      tutorBookings.value = []
    }
    tutorBookings.value = bookings
  } catch (err) {
    console.error('Error fetching tutor details:', err)
  }
}

const fetchTutorDetails = async tutorId => {
  try {
    const response = await axiosInstance.get(`/api/tutor-detail/${tutorId}`)
    tutorDetails.value = response.data.tutor
    tutorWorkDays.value = tutorDetails.value.work_days
  } catch (err) {
    console.error('Error fetching tutor details:', err)
  }
}

watch(
  () => bookingState.learningPreference,
  newMode => {
    if (newMode === 'In School') {
      bookingState.location = 'CCTC'
    } else if (newMode === 'Face to Face') {
      bookingState.location = ''
    }
  },
)

const isKeyboardVisible = ref(false)

const handleResize = () => {
  // Check if the viewport height is significantly reduced, indicating the keyboard is visible
  isKeyboardVisible.value = window.innerHeight < window.outerHeight - 100
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize() // Initial check
  const initialTutorId = route.params.tutorId
  if (initialTutorId) {
    fetchTutorDetails(initialTutorId)
    fetchTutorSchedules(initialTutorId)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
