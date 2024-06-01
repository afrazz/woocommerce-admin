import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth } from 'config/firebaseConfig'
import { signInWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth'
import errorHandler from 'utils/errorHandler';


interface IState {
    loading: boolean;
    authPageLoading: boolean;
    token: string | null;
    user: object | null
}

export const initialState: IState = {
  loading: false,
  authPageLoading: true,
  token: null,
  user: null,
}

// SIGNIN Action
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data:{email: string, password: string}, { dispatch, rejectWithValue }) => {
    const { email, password } = data
    try {
      const {user} = await signInWithEmailAndPassword(auth, email, password);
      const {token} = await user.getIdTokenResult()

      return { token, user }

    } catch (err: any) {
      return rejectWithValue(err.message || 'Error')
    }
  }
)


export const signOut = createAsyncThunk('auth/signOut', async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await fbSignOut(auth)
        return response
    } catch(err: any) {
        return rejectWithValue(err.message || 'Error')
    }

})


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true
    },
    setAuthPageLoading: (state:IState, action) => {
        state.authPageLoading = action.payload    
    },
    setAuthenticated: (state:IState, action) => {
        state.loading = false
        state.token = action?.payload?.token
        state.user = action?.payload?.user
        state.authPageLoading = false        
    }
  },
  extraReducers: (builder) => {
    builder
      // .addCase(signIn.pending, (state: IState) => {
      //   // state.loading = true
      // })
      .addCase(signIn.fulfilled, (state: IState, action) => {
        // state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(signIn.rejected, (state:IState, action) => {
        // state.loading = false
        const error = action.payload as string
        errorHandler(error)
      })
      .addCase(signOut.fulfilled, (state:IState) => {
        state.loading = false
        state.token = null
        state.user = null
      })
      .addCase(signOut.rejected, (state: IState) => {
        state.loading = false
        state.token = null
        state.user = null
      })
     
  },
})

export const {
    showLoading,
    setAuthenticated,
    setAuthPageLoading
} = authSlice.actions

export default authSlice.reducer
