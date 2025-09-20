import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API || '' }); // set proxy or REACT_APP_API=http://localhost:5000
export default API;
