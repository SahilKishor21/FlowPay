import axios from 'axios'

const API_URL = 'https://flowpay-ca5c.onrender.com/api' 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status)
    return response
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request Timeout')
    } else if (error.response) {
      console.error(`❌ API Error (${error.response.status}):`, error.response.data)
    } else if (error.request) {
      console.error('❌ No Response from Server:', error.message)
    } else {
      console.error('❌ Request Setup Error:', error.message)
    }
    return Promise.reject(error)
  }
)

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

// Invoice APIs
export const invoiceAPI = {
  getAll: async () => {
    const response = await api.get('/invoices')
    return response.data
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/invoices/${id}`)
    return response.data
  },
  
  create: async (data: any) => {
    const response = await api.post('/invoices', data)
    return response.data
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/invoices/${id}`, data)
    return response.data
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/invoices/${id}`)
    return response.data
  },
  
  autoReconcile: async () => {
    const response = await api.post('/invoices/reconcile')
    return response.data
  },
}

// Client APIs
export const clientAPI = {
  getAll: async () => {
    const response = await api.get('/clients')
    return response.data
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/clients/${id}`)
    return response.data
  },
  
  create: async (data: any) => {
    const response = await api.post('/clients', data)
    return response.data
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/clients/${id}`, data)
    return response.data
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/clients/${id}`)
    return response.data
  },
  
  calculateRisk: async (id: string) => {
    const response = await api.post(`/clients/${id}/calculate-risk`)
    return response.data
  },
}

// OCR APIs
export const ocrAPI = {
  extractCheque: async (file: File) => {
    const formData = new FormData()
    formData.append('chequeImage', file)
    
    const response = await api.post('/ocr/extract-cheque', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, 
    })
    return response.data
  },
}

// Notification APIs
export const notificationAPI = {
  sendPDCReminder: async (data: any) => {
    const response = await api.post('/notifications/send-pdc-reminder', data)
    return response.data
  },
  
  sendBounceNotification: async (data: any) => {
    const response = await api.post('/notifications/send-bounce-notification', data)
    return response.data
  },
}

// Health check
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health', { timeout: 2000 })
    return { connected: true, data: response.data }
  } catch (error) {
    return { connected: false, error }
  }
}

export default api