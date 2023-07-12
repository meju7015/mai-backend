import axios from 'axios';

const client = axios.create({});

client.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    return err.response;
  },
);

export default client;
