<template>
  <main class="bg-blue-100">
    <SideBar>
      <main class="container pt-3 pb-7 mx-auto">
        <!-- Profile Header -->
        <TutorProfileHeader></TutorProfileHeader>

        <!-- Profile Content -->
        <div
          class="flex flex-col tablet:flex-row mt-4 space-y-4 tablet:space-y-0 tablet:space-x-4"
        >
          <!-- Subjects, Rating, and Availability -->
          <section class="w-full tablet:w-1/3 p-4 bg-white rounded-lg shadow-md">
            <div class="space-y-4">
              <div>
                <h3 class="font-semibold">Ratings:</h3>
                <span class="flex items-center gap-2">
                  <StarRating
                    :rating="averageRatings ? averageRatings : 0"
                  ></StarRating>
                  <span class="text-gray-500"
                    >{{ userData.ratings.length }} Rated</span
                  >
                </span>
              </div>

              <TutorProfileSubjects></TutorProfileSubjects>

              <div>
                <h3 class="font-semibold">Availability:</h3>
                <TutorProfileWorkDays />
                <TutorProfileWorkHours />
              </div>

              <TutorProfileRate></TutorProfileRate>
              <TutorLinks></TutorLinks>

              <TutorProfileDetails></TutorProfileDetails>
            </div>
          </section>

          <!-- Bio, Education, and Certification -->
          <section class="flex-1 space-y-4">
            <div class="p-4 bg-white rounded-lg shadow-md">
              <TutorProfileBiography></TutorProfileBiography>
            </div>

            <div class="p-4 bg-white rounded-lg shadow-md">
              <h3 class="font-semibold">Education</h3>
              <TutorProfileEducation></TutorProfileEducation>
            </div>

            <div class="p-4 bg-white rounded-lg shadow-md">
              <h3 class="font-semibold">Certification</h3>
              <TutorProfileCertificate></TutorProfileCertificate>
            </div>

            <div class="p-4 bg-white rounded-lg shadow-md">
              <h3 class="font-semibold">Proof of qualification</h3>
              <TutorProfileCredentials></TutorProfileCredentials>
            </div>

            <div class="p-4 bg-white rounded-lg shadow-md">
              <div v-if="userData.ratings.length <= 0">
                <p>No ratings yet</p>
              </div>
              <div v-else>
                <h3 class="font-semibold">Ratings</h3>
                <RatingsCarousel
                  class="w-full"
                  :ratingComments="ratingComments"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </SideBar>
    <FooterSection class="tablet:hidden" />

    <!-- <HelpButton /> -->
  </main>
</template>

<script setup>
import FooterSection from '@/sections/FooterSection.vue'
import TutorProfileCertificate from '@/components/tutor/TutorProfile/TutorProfileCertificate.vue'
import TutorProfileEducation from '@/components/tutor/TutorProfile/TutorProfileEducation.vue'
import TutorProfileBiography from '@/components/tutor/TutorProfile/TutorProfileBiography.vue'
import TutorProfileDetails from '@/components/tutor/TutorProfile/TutorProfileDetails.vue'
import TutorProfileRate from '@/components/tutor/TutorProfile/TutorProfileRate.vue'
import TutorProfileWorkDays from '@/components/tutor/TutorProfile/TutorProfileWorkDays.vue'
import TutorProfileWorkHours from '@/components/tutor/TutorProfile/TutorProfileWorkHours.vue'
import TutorProfileSubjects from '@/components/tutor/TutorProfile/TutorProfileSubjects.vue'
import TutorProfileHeader from '@/components/tutor/TutorProfile/TutorProfileHeader.vue'
import RatingsCarousel from '@/components/RatingsCarousel.vue'
import SideBar from '@/components/SideBar.vue'
// import HelpButton from '@/components/HelpButton.vue'
import StarRating from '@/components/StarRating.vue'
import { computed, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import { getUserData } from '@/utils/user'
import TutorLinks from '@/components/tutor/TutorProfile/TutorLinks.vue'
import TutorProfileCredentials from '@/components/tutor/TutorProfile/TutorProfileCredentials.vue'

const userData = getUserData()

const averageRatings = computed(() => {
  const ratings = userData.value.ratings.map(rating => rating.rate)
  const total = ratings.reduce((sum, rate) => sum + rate, 0)
  return total / ratings.length
})

const ratingComments = computed(() => {
  const ratingsWithComments = userData.value.ratings.filter(
    rating => !!rating.comment,
  )
  return ratingsWithComments
})

const fetchTutorProfileInfo = async () => {
  try {
    const response = await axiosInstance.get(`/api/tutor-info`)
    userData.value = response.data.tutor
    localStorage.setItem('user_data', JSON.stringify(userData.value))
  } catch (err) {
    console.error('Error fetching tutor details:', err)
  }
}

onMounted(fetchTutorProfileInfo)
</script>
