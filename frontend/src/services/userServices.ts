import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ILoginFormData, IRegisterFormData, IUpdateUserData } from '../models'

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const registerUser = createAsyncThunk(
    'user/register',
    async (formData: IRegisterFormData, { rejectWithValue }) => {
        try {
            const data = {
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            };
            const config = {
                method: 'POST',
                url: `${BASE_URL}/user/`,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(data),
            };
            const response = await axios(config);
            return await response.data;
        } catch (error) {
            return rejectWithValue('Ошибка на стороне сервера: ' + error);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (formData: ILoginFormData, { rejectWithValue }) => {
        try {
            const config = {
                method: 'POST',
                url: `${BASE_URL}/user/login/`,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(formData),
            };
            const response = await axios(config);
            return await response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue('Ошибка входа: ' + error.response.data.non_field_errors[0]);
            }
            return rejectWithValue('Неизвестная ошибка входа');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const config = {
                method: 'POST',
                url: `${BASE_URL}/user/logout/`,
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            };
            const response = await axios(config);
            return await response.data;
        } catch (error) {
            return rejectWithValue('Ошибка выхода пользователя из системы: ' + error);
        }
    }
);

export const getUsersList = createAsyncThunk(
    'user/list',
    async (_, { rejectWithValue }) => {
        try {
            const config = {
                method: 'GET',
                url: `${BASE_URL}/user/`,
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            };
            const response = await axios(config);
            return await response.data;
        } catch (error) {
            return rejectWithValue('Ошибка получения списка пользователей: ' + error);
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    async (userData: IUpdateUserData, { rejectWithValue }) => {
        try {
            const config = {
                method: 'PATCH',
                url: `${BASE_URL}/user/${userData.id}/`,
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${localStorage.getItem('token')}`
                },
                data: JSON.stringify(userData),
            };
            const response = await axios(config);
            return await response.data;
        } catch (error) {
            return rejectWithValue('Ошибка редактирования данных пользователя: ' + error);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            const config = {
                method: 'DELETE',
                url: `${BASE_URL}/user/${id}/`,
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            };
            const response = await axios(config);
            return await response.data;
        } catch (error) {
            return rejectWithValue('Ошибка удаления пользователя: ' + error);
        }
    }
);