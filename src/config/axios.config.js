// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// export const fetchPublicContent = async (endpoint) => {
//   try {
//     console.log(`Fetching from: ${API_BASE_URL}/public/${endpoint}`);

//     const response = await axios.get(`${API_BASE_URL}/public/${endpoint}`);

//     console.log(`Response for ${endpoint}:`, response.data);

//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching ${endpoint}:`, error);
//     return {
//       success: false,
//       message: error.message,
//       [endpoint]: [],
//     };
//   }
// };

// const instance = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default instance;
