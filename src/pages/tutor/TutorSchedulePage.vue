<template>
  <main class="min-h-screen bg-blue-100">
    <SideBar>
      <main class="container grid grid-rows-[auto,1fr] gap-10 tablet:min-h-screen py-5 mx-auto">
        <!-- Breadcrumb -->
        <div class="">
          <BreadCrumb
            :breadcrumbs="[{ label: 'Schedule', route: '/tutor/schedule' }]"
          />
        </div>
        <div class="">
          <SchedulesCalendar :routePath="'/tutor/schedule'" />
        </div>
      </main>
    </SideBar>

    <!-- <HelpButton /> -->
  </main>
</template>

<script setup>
import BreadCrumb from '@/components/BreadCrumb.vue'
import SchedulesCalendar from '@/components/shared/calendar/SchedulesCalendar.vue'
import SideBar from '@/components/SideBar.vue'
// import HelpButton from '@/components/HelpButton.vue'
</script>
