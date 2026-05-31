import { apiSlice } from './apiSlice.js';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/orders/stats/dashboard',
      providesTags: ['Order'],
    }),
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/myorders',
      providesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    payOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/pay`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        'Order',
      ],
    }),
    deliverOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        'Order',
      ],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  usePayOrderMutation,
  useDeliverOrderMutation,
} = orderApi;
