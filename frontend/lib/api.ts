import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://flowpay-ca5c.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Cheque APIs
export const chequeAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/cheques', { params })
    return response.data
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/cheques/${id}`)
    return response.data
  },
  
  create: async (data: any) => {
    const response = await api.post('/cheques', data)
    return response.data
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/cheques/${id}`, data)
    return response.data
  },
  
  updateStatus: async (id: string, status: string, additionalData?: any) => {
    const response = await api.patch(`/cheques/${id}/status`, {
      status,
      ...additionalData,
    })
    return response.data
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/cheques/${id}`)
    return response.data
  },
  
  getUpcoming: async () => {
    const response = await api.get('/cheques/upcoming/reminders')
    return response.data
  },
}

// Cash APIs
export const cashAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/cash', { params })
    return response.data
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/cash/${id}`)
    return response.data
  },
  
  create: async (data: any) => {
    const response = await api.post('/cash', data)
    return response.data
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/cash/${id}`, data)
    return response.data
  },
  
  verify: async (id: string, verifiedBy: string) => {
    const response = await api.patch(`/cash/${id}/verify`, { verifiedBy })
    return response.data
  },
  
  markBankDeposit: async (id: string, bankName: string, bankDepositDate: string) => {
    const response = await api.patch(`/cash/${id}/bank-deposit`, {
      bankName,
      bankDepositDate,
    })
    return response.data
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/cash/${id}`)
    return response.data
  },
}

// Dashboard APIs
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/payments/dashboard')
    return response.data
  },
  
  getUpcomingPayments: async () => {
    const response = await api.get('/payments/upcoming')
    return response.data
  },
}

// Analytics APIs
export const analyticsAPI = {
  getMonthlySummary: async () => {
    const response = await api.get('/analytics/monthly-summary')
    return response.data
  },
  
  getPaymentTrends: async () => {
    const response = await api.get('/analytics/payment-trends')
    return response.data
  },
}

export default api