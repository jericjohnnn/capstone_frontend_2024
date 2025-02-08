<template>
  <NavBar />
  <div
    class="min-h-[calc(100vh-5rem)] flex justify-center items-center bg-gray-50"
  >
    <NotificationToast
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
    />
    <div class="max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-lg">
      <div class="p-4 sm:p-8">
        <!-- Header -->
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
          Sign up as <span class="text-blue-600">TUTOR</span>
        </h2>

        <!-- Stepper -->
        <div class="mb-6 sm:mb-8 overflow-x-auto">
          <ul class="flex justify-center items-center min-w-max mx-auto">
            <li
              v-for="step in steps"
              :key="step.id"
              class="group flex items-center"
            >
              <div class="flex items-center">
                <span
                  :class="{
                    'bg-blue-600 text-white ring-2 ring-blue-100':
                      currentStep >= step.id,
                    'bg-gray-100 text-gray-600': currentStep < step.id,
                  }"
                  class="h-6 w-6 sm:h-8 sm:w-8 flex justify-center items-center rounded-full font-semibold text-xs sm:text-sm transition-all duration-200"
                >
                  {{ step.id }}
                </span>
                <div
                  class="mx-2 sm:mx-4 h-0.5 w-12 sm:w-20 bg-gray-200 group-last:hidden"
                ></div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="w-full max-w-md mx-auto">
          <!-- Step 1: Personal Information -->
          <div v-if="currentStep === 1" class="space-y-3 sm:space-y-4">
            <h3 class="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
              Personal Information
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                v-model="form.firstName"
                placeholder="First name"
                required
                class="col-span-1 h-10 sm:h-11 px-3 sm:px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 text-sm sm:text-base w-full"
              />
              <input
                type="text"
                v-model="form.lastName"
                placeholder="Last name"
                required
                class="col-span-1 h-10 sm:h-11 px-3 sm:px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 text-sm sm:text-base w-full"
              />
            </div>
            <input
              type="text"
              v-model="form.address"
              placeholder="Address"
              required
              class="w-full h-10 sm:h-11 px-3 sm:px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 text-sm sm:text-base"
            />
            <input
              type="date"
              v-model="form.birthdate"
              required
              class="w-full h-10 sm:h-11 px-3 sm:px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 text-sm sm:text-base text-gray-600"
            />
            <select
              v-model="form.gender"
              required
              class="w-full h-10 sm:h-11 px-3 sm:px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 bg-white text-sm sm:text-base text-gray-700"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              v-model="form.contactNo"
              placeholder="Contact Number"
              required
              class="w-full h-10 sm:h-11 px-3 sm:px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          <!-- Step 2: Education Information -->
          <div v-if="currentStep === 2" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">
              Education Information
            </h3>
            <input
              type="text"
              v-model="form.schoolIdNumber"
              placeholder="School ID Number"
              required
              class="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
            />
            <select
              v-model="form.course"
              required
              class="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 bg-white text-gray-700"
            >
              <option value="" disabled>Select Course</option>
              <option value="BSED">BSED</option>
              <option value="BEED">BEED</option>
              <option value="BSIT">BSIT</option>
              <option value="BSHM">BSHM</option>
              <option value="BSENTREP">BSENTREP</option>
            </select>
            <select
              v-model="form.year"
              required
              class="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 bg-white text-gray-700"
            >
              <option value="" disabled>Select Year</option>
              <option v-for="n in 4" :key="n" :value="n">Year {{ n }}</option>
            </select>

            <!-- Subject Selection -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Select Subjects</label
              >
              <div class="flex flex-col sm:flex-row gap-2">
                <select
                  v-model="selectedSubject"
                  class="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="" disabled selected>Select a subject</option>
                  <option
                    v-for="subject in subjects"
                    :key="subject.id"
                    :value="subject.id"
                  >
                    {{ subject.name }}
                  </option>
                </select>
                <button
                  @click.prevent="addSubject"
                  class="w-full sm:w-auto px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  :disabled="!selectedSubject"
                >
                  Add
                </button>
              </div>

              <!-- Selected Subjects Tags -->
              <div class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="subjectId in form.subjects"
                  :key="subjectId"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700"
                >
                  {{ getSubjectName(subjectId) }}
                  <button
                    @click.prevent="removeSubject(subjectId)"
                    class="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Step 3: Upload Proof of qualifications -->
          <div v-if="currentStep === 3" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">
              Proof of qualification
            </h3>

            <!-- Image Previews -->
            <div class="flex flex-wrap gap-4">
              <div
                v-for="(image, index) in selectedImages"
                :key="index"
                class="relative w-24 h-24 border rounded-lg"
              >
                <img
                  :src="image.preview"
                  class="w-full h-full object-cover rounded-lg"
                />
                <button
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Image Selection Button -->
            <button
              type="button"
              @click="openFileSelector"
              class="w-full py-2 px-4 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              + Add Qualifications
            </button>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handleImageSelect"
            />
          </div>

          <!-- Step 4: Account Information -->
          <div v-if="currentStep === 4" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">
              Account Information
            </h3>
            <input
              type="email"
              v-model="form.email"
              placeholder="Email"
              required
              class="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
            />
            <input
              type="password"
              v-model="form.password"
              placeholder="Password"
              required
              class="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
            />
            <input
              type="password"
              v-model="form.confirmPassword"
              placeholder="Confirm password"
              required
              class="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
            />

            <div class="p-4 bg-gray-50 rounded-lg">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="form.agreeToTerms"
                  required
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-600">
                  I agree to
                  <a href="#" class="text-blue-600 hover:text-blue-700"
                    >Terms & Conditions</a
                  >
                </span>
              </label>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8">
            <button
              type="button"
              v-if="currentStep > 1"
              @click="prevStep"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="button"
              v-if="currentStep < 4"
              @click="nextStep"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Next
            </button>
            <button
              v-if="currentStep === 4"
              type="submit"
              :disabled="!form.agreeToTerms || isLoading"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              :class="
                form.agreeToTerms
                  ? 'text-white bg-blue-600 hover:bg-blue-700'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              "
            >
              <span v-if="isLoading"><LoaderSpinner /></span>
              <span v-else>Sign up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <FooterSection />
</template>

<script setup>
import NavBar from '../../sections/NavBar.vue'
import FooterSection from '../../sections/FooterSection.vue'
import { reactive, ref, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import router from '@/router'
import NotificationToast from '@/components/Reusables/NotificationToast.vue'
import { useNotification } from '@/composables/useNotification'
import LoaderSpinner from '@/components/Reusables/LoaderSpinner.vue'

const { notification, showNotification } = useNotification()

const fileInput = ref(null)
const selectedImages = ref([])
const originalImages = ref([]);

const openFileSelector = () => {
  fileInput.value.click()
}

const handleImageSelect = event => {
  const file = event.target.files[0]
  if (!file) {
    return
  }

  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      selectedImages.value.push({
        file: file,
        preview: e.target.result,
      })
      originalImages.value.push(file);
    };
    reader.readAsDataURL(file);
  }
  event.target.value = ""
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1);
  originalImages.value.splice(index, 1);
};

const currentStep = ref(1)

const steps = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  address: '',
  birthdate: '',
  gender: '',
  schoolIdNumber: '',
  course: '',
  year: '',
  agreeToTerms: false,
  subjects: [],
  contactNo: '',
})

const selectedSubject = ref('')

const subjects = ref([])

const isLoading = ref(false)

const getSubjectName = id => {
  const subject = subjects.value.find(subject => subject.id === id)
  return subject ? subject.name : ''
}

const nextStep = () => {
  if (currentStep.value < steps.value.length) {
    if (validateCurrentStep()) {
      currentStep.value++
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const validateCurrentStep = () => {
  if (currentStep.value === 1) {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.address.trim() ||
      !form.birthdate ||
      !form.gender ||
      !form.contactNo.trim()
    ) {
      showNotification(
        'Please fill in all personal information fields',
        'error',
      )
      return false
    }
  } else if (currentStep.value === 2) {
    if (
      !form.schoolIdNumber.trim() ||
      !form.course ||
      !form.year ||
      form.subjects.length === 0
    ) {
      showNotification(
        'Please fill in all education information fields and select at least one subject',
        'error',
      )
      return false
    }
  } else if (currentStep.value === 3) {
    if (selectedImages.value.length === 0) {
      showNotification(
        'Please upload at least one of your documents or credentials',
        'error',
      )
      return false
    }
  }
  return true
}

const addSubject = () => {
  if (!selectedSubject.value) {
    showNotification('Please select a subject first', 'error')
    return
  }

  if (!form.subjects.includes(selectedSubject.value)) {
    form.subjects.push(selectedSubject.value)
    selectedSubject.value = ''
  } else {
    showNotification('This subject is already selected', 'error')
  }
}

const removeSubject = subjectId => {
  form.subjects = form.subjects.filter(id => id !== subjectId)
}

const fetchSubjects = async () => {
  try {
    const response = await axiosInstance.get('/api/subjects')
    subjects.value = response.data.subjects
  } catch (err) {
    console.error('Error fetching subjects:', err)
    showNotification(
      'Failed to load subjects. Please refresh the page.',
      'error',
    )
  }
}

const handleSubmit = async () => {
  if (form.password !== form.confirmPassword) {
    showNotification('Passwords do not match!', 'error')
    return
  }

  if (!form.agreeToTerms) {
    showNotification('Please agree to the Terms & Conditions', 'error')
    return
  }

  isLoading.value = true

  const payLoad = new FormData()
  payLoad.append('user_type_id', 2)
  payLoad.append('email', form.email)
  payLoad.append('password', form.password)
  payLoad.append('password_confirmation', form.confirmPassword)
  payLoad.append('first_name', form.firstName)
  payLoad.append('last_name', form.lastName)
  payLoad.append('address', form.address)
  payLoad.append('birthdate', form.birthdate)
  payLoad.append('gender', form.gender)
  payLoad.append('contact_number', form.contactNo)
  payLoad.append('school_id_number', form.schoolIdNumber)
  payLoad.append('course', form.course)
  payLoad.append('year', form.year)
  form.subjects.forEach((subject) => {
    payLoad.append('subjects[]', subject);
  });
  originalImages.value.forEach((file) => {
    payLoad.append('images[]', file);
  });

  try {
    const response = await axiosInstance.post('api/register', payLoad)
    const { user_email, user_full_name, user_type, user_data, token } =
      response.data

    showNotification('Registration submitted!', 'success')

    localStorage.setItem('app_auth_token', token)
    localStorage.setItem('newTutor', true)
    localStorage.setItem('user_type', user_type)
    localStorage.setItem('user_email', user_email)
    localStorage.setItem('user_full_name', user_full_name)
    localStorage.setItem('user_data', JSON.stringify(user_data))

    setTimeout(() => {
      router.push('/tutor/pending-approval')
    }, 1500)
  } catch (error) {
    console.error('Registration error:', error)
    showNotification(
      error.response?.data?.message || 'Registration failed. Please try again.',
      'error',
    )
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSubjects()
})
</script>
