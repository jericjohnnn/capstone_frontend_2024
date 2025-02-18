// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// // Pusher.logToConsole = true;
// window.Pusher = Pusher;

// export const initializeEcho = () => {
//   const authToken = localStorage.getItem('app_auth_token')
//   return new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//     forceTLS: true,
//     authEndpoint: `${import.meta.env.VITE_API_BASE_URL}api/broadcasting/auth`,
//     auth: {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     },
//   })
// }
