import { Action, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import myAxios from '@/lib/myAxios';

export interface MyAction<T> extends Action {
  payload: T;
}

// Define a type for the slice state
export interface UserState {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  image: string;
}

export interface State {
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  entities: UserState[];
  error: string | null;
}

// Define the initial state using that type
const initialState: State = {
  status: 'idle',
  entities: [],
  error: null,
};

export const fetchUsers = createAsyncThunk<string | UserState[]>('users', async () => {
  try {
    const response = await myAxios.get<UserState[]>('/users');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }

    return 'An error occurred';
  }
});

export const saveNewUser = createAsyncThunk<string | UserState, Omit<UserState, 'id'>>(
  'users/create',
  async (payload) => {
    try {
      const response = await myAxios.post<UserState>('/users', JSON.stringify(payload));
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return 'An error occurred';
    }
  }
);

export const updateUser = createAsyncThunk<string | UserState, { payload: UserState; id: string }>(
  'users/update',
  async ({ payload, id }) => {
    try {
      const response = await myAxios.put<UserState>(`users/${id}`, JSON.stringify(payload));
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return 'An error occurred';
    }
  }
);

export const deleteUser = createAsyncThunk<string, string>('users/delete', async (id) => {
  try {
    await myAxios.delete<UserState>(`users/${id}`);
    return id;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }

    return 'An error occurred';
  }
});

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    mCreateUser: (state, action: MyAction<Omit<UserState, 'id'>>) => {
      state.entities.push({
        id: state.entities.length + 1,
        ...action.payload,
      });
    },
    mUpdateUser: (state, action: MyAction<UserState>) => {
      const user = action.payload;
      const index = state.entities.findIndex((item) => item.id === user.id);
      state.entities[index] = user;
    },
    mDeleteUser: (state, action: MyAction<number>) => {
      const id = action.payload;
      const index = state.entities.findIndex((u) => u.id === Number(id));
      state.entities.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload as UserState[];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(saveNewUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveNewUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const user = action.payload as UserState;
        state.entities[user.id] = user;
      })
      .addCase(saveNewUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const user = action.payload as UserState;
        state.entities[user.id] = user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const id = action.payload as string;
        delete state.entities[Number(id)];
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export const { mCreateUser, mUpdateUser, mDeleteUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserById = (state: RootState, id: number) =>
  state.users.entities.find((user) => user.id === id);
export const users = (state: RootState) => state.users.entities;
export const usersStatus = (state: RootState) => state.users.status;
export const usersError = (state: RootState) => state.users.error;

export default userSlice.reducer;
