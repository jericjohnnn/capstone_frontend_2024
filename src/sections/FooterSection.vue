<template>
  <footer class="bg-gray-800 text-white py-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 tablet:grid-cols-2 gap-8">
        <!-- About Section -->
        <div>
          <h3 class="text-lg font-semibold mb-4">About Us</h3>
          <p class="text-gray-300">
            TUDLO connects students with qualified tutors for personalized learning experiences.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="flex gap-4">
            <li><router-link to="/" class="text-gray-300 hover:text-white">Home</router-link></li>
            <li><router-link to="/about" class="text-gray-300 hover:text-white">About</router-link></li>
            <li><router-link to="/contact" class="text-gray-300 hover:text-white">Contact</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="text-center mt-8 pt-8 border-t border-gray-700">
        <p class="text-gray-400">
          © {{ new Date().getFullYear() }} TUDLO. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No additional logic needed for this simple footer
</script>
