import axios from 'axios';

const ax = axios.create({
    baseURL: '/hs',
    timeout: 2000
});

ax.interceptors.response.use(
    res => {
        return res.data.data;
    },
    error => {
    }
);

export default (url, method = 'GET') => (params, configs) => {
    method = method.toLowerCase();

    if (method === 'get') {
        params = {params};
    }

    return ax[method](url, params, configs);
}
