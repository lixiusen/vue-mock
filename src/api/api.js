//通过api.js对api请求统计管理
import axios from 'axios';

let  base = '';

export const requestLogin = params => { return axios.post(`${base}/login`,params).then(res => res.data)};

export const getUserList = params => { return axios.get(`${base}/user/list`,{params:params})};

export const getUserListPage = params =>{ return axios.get(`${base}/user/listPage`,{params:params})};

export const addUser = params => { return axios.get(`${base}/user/add`,{params: params})};

export const editUser = params => { return axios.get(`${base}/user/edit`,{ params: params})};

export const deleteUser = params =>{ return axios.get(`${base}/user/delete`,{params:params})};

export const  deleteGroup = params =>{ return axios.get(`${base}/user/deleteGroup`,{params:params})};


