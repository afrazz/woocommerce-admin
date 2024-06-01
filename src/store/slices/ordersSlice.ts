import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderServices from 'services/orders';
import { getItemFromLocalStorage } from 'utils/localstorage';
import { TableParams } from 'utils/tableQueryParams';

interface IState {
    loading: boolean;
    orders: [];
    orderTableParams: TableParams;
    orderTourOpen: boolean;
    singleOrder: any
}

export const initialState: IState = {
  loading: false,
  orders: [],
  orderTableParams: {
    pagination: {
      current: 1,
      pageSize: 5,
    },
  },
  orderTourOpen: false,

  // for single Order
  singleOrder: {}
}

// Get Orders Async Call
export const getOrders = createAsyncThunk(
  'orders/getAllOrders',
  async (queries:object, { dispatch, rejectWithValue }) => {
    try {
    const data = await orderServices.getOrder(queries);
      return data

    } catch (err: any) {
      return rejectWithValue(err.message || 'Error')
    }
  }
)

// Get Orders Async Call
export const getOrderById = createAsyncThunk(
  'orders/getSingleOrder',
  async (id: string | number, { dispatch, rejectWithValue }) => {
    try {
    const data = await orderServices.getOrderById(id);
      return data
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error')
    }
  }
)

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true
    },
    setorderTableParams: (state, action) => {
      state.orderTableParams = action.payload
    },
    setOrders: (state, action) => {
      state.orders = action.payload
    },
    setOrderTour: (state, action) => {
      state.orderTourOpen = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state: IState) => {
        state.loading = true
      })
      .addCase(getOrders.fulfilled, (state: IState, action) => {
        state.loading = false
        state.orders = action.payload;

        // Setting Paginations, Filters, Sorters 
        state.orderTableParams = {
            ...state.orderTableParams,
            pagination: {
              ...state.orderTableParams.pagination,
              total: 200,
              pageSizeOptions: [1, 2, 3, 5, 10, 20, 50, 100],
              // 200 is mock data, you should read it from server
              // total: data.totalCount,
            }
          }

          // Checking if Already Tours Shown
          const isTourOpen = getItemFromLocalStorage("tourOpen");
          if (!isTourOpen) {
            state.orderTourOpen = true
          }
      })
      .addCase(getOrders.rejected, (state:IState, action) => {
        state.loading = false
        console.log(action.payload)
      })
      
      // SingleOrder 
      .addCase(getOrderById.pending, (state: IState) => {
        state.loading = true
      })
      .addCase(getOrderById.fulfilled, (state: IState, action) => {
        state.loading = false
        state.singleOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state:IState, action) => {
        state.loading = false
        console.log(action.payload)
      })
  },
})

export const {
    showLoading,
    setorderTableParams,
    setOrders,
    setOrderTour
} = ordersSlice.actions

export default ordersSlice.reducer
