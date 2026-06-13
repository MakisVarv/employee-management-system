import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchEmployees = createAsyncThunk(
  'employees/fetch',
  async ({ page, search, type, sort, order }) => {
    const res = await API.get('/employees', {
      params: {
        skip: page * 10,
        limit: 10,
        search,
        type,
        sort_by: sort,
        order,
      },
    });

    return res.data;
  },
);
export const getEmployee = createAsyncThunk(
  'employees/get',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/employees/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to get employee',
      );
    }
  },
);

export const addEmployee = createAsyncThunk(
  'employees/add',
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/employees', data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to add employee',
      );
    }
  },
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to delete employee',
      );
    }
  },
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/employees/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to update employee',
      );
    }
  },
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchEmployees.rejected, (state) => {
        state.loading = false;
        state.error = 'Error loading employees';
      })

      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (e) => e.id !== action.payload,
        );
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (e) => e.id === action.payload.id,
        );
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default employeesSlice.reducer;
