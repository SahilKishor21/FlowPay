"use client"

import { create } from 'zustand'
import { chequeAPI, cashAPI, dashboardAPI, clientAPI } from '@/lib/api'

interface Cheque {
  _id: string
  clientId?: string
  clientName: string
  chequeNumber: string
  bankName: string
  amount: number
  dueDate: string
  status: 'Pending' | 'Cleared' | 'Bounced' | 'Post-Dated'
  bounceReason?: string
  ocrData?: any
}

interface CashTransaction {
  _id: string
  clientId?: string
  clientName: string
  receiptNumber: string
  amount: number
  date: string
  verified: boolean
  denominationBreakdown?: Array<{ value: number; count: number; total: number }>
}

interface Client {
  _id: string
  name: string
  companyName: string
  email: string
  phone: string
  riskScore: number
  riskLevel: 'Low' | 'Medium' | 'High'
  creditLimit: number
  outstandingAmount: number
  bounceCount: number
}

interface Stats {
  totalOutstanding: number
  pendingCheques: number
  clearedThisMonth: number
  bounceRate: number
}

interface PaymentStore {
  cheques: Cheque[]
  cashTransactions: CashTransaction[]
  clients: Client[]
  stats: Stats
  lastUpdated: string
  loading: boolean
  error: string | null
  backendConnected: boolean
  initialized: boolean
  isInitializing: boolean
  
  fetchCheques: () => Promise<void>
  fetchCashTransactions: () => Promise<void>
  fetchClients: () => Promise<void>
  fetchDashboardData: () => Promise<void>
  addCheque: (cheque: any) => Promise<void>
  addCashTransaction: (transaction: any) => Promise<void>
  addClient: (client: any) => Promise<void>
  updateChequeStatus: (id: string, status: string, bounceReason?: string) => Promise<void>
  refreshData: () => Promise<void>
  calculateStats: () => void
  initializeStore: () => Promise<void>
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  cheques: [],
  cashTransactions: [],
  clients: [],
  stats: {
    totalOutstanding: 0,
    pendingCheques: 0,
    clearedThisMonth: 0,
    bounceRate: 0,
  },
  lastUpdated: 'just now',
  loading: false,
  error: null,
  backendConnected: false,
  initialized: false,
  isInitializing: false,

  fetchCheques: async () => {
    try {
      const data = await chequeAPI.getAll()
      set({ 
        cheques: data, 
        backendConnected: true,
        error: null 
      })
      get().calculateStats()
    } catch (error) {
      console.error('Failed to fetch cheques:', error)
      set({ backendConnected: false })
      throw error
    }
  },

  fetchCashTransactions: async () => {
    try {
      const data = await cashAPI.getAll()
      set({ 
        cashTransactions: data, 
        backendConnected: true,
        error: null 
      })
      get().calculateStats()
    } catch (error) {
      console.error('Failed to fetch cash transactions:', error)
      set({ backendConnected: false })
      throw error
    }
  },

  fetchClients: async () => {
    try {
      const data = await clientAPI.getAll()
      set({ 
        clients: data, 
        backendConnected: true,
        error: null 
      })
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      // Don't throw - clients are optional
      set({ clients: [] })
    }
  },

  fetchDashboardData: async () => {
    try {
      const data = await dashboardAPI.getStats()
      
      if (data.stats) {
        set({ 
          stats: data.stats,
          backendConnected: true,
          error: null 
        })
      }
      
      if (data.recentCheques) {
        set({ cheques: data.recentCheques })
      }
      
      if (data.recentCash) {
        set({ cashTransactions: data.recentCash })
      }
      
      get().calculateStats()
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      set({ backendConnected: false })
      throw error
    }
  },

  calculateStats: () => {
    const { cheques, cashTransactions } = get()
    
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const pendingCheques = cheques.filter(c => 
      c.status === 'Pending' || c.status === 'Post-Dated'
    )
    
    const totalOutstanding = pendingCheques.reduce((sum, c) => sum + c.amount, 0)
    
    const clearedThisMonth = [
      ...cheques.filter(c => {
        if (c.status !== 'Cleared') return false
        const chequeDate = new Date(c.dueDate)
        return chequeDate.getMonth() === currentMonth && chequeDate.getFullYear() === currentYear
      }),
    ].reduce((sum, c) => sum + c.amount, 0) + 
    cashTransactions.filter(t => {
      const txDate = new Date(t.date)
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear && t.verified
    }).reduce((sum, t) => sum + t.amount, 0)

    const bouncedCheques = cheques.filter(c => c.status === 'Bounced').length
    const totalProcessedCheques = cheques.filter(c => 
      c.status === 'Cleared' || c.status === 'Bounced'
    ).length
    
    const bounceRate = totalProcessedCheques > 0 
      ? parseFloat(((bouncedCheques / totalProcessedCheques) * 100).toFixed(1))
      : 0

    set({
      stats: {
        totalOutstanding,
        pendingCheques: pendingCheques.length,
        clearedThisMonth,
        bounceRate,
      },
    })
  },

  addCheque: async (cheque) => {
    try {
      set({ loading: true, error: null })
      const newCheque = await chequeAPI.create(cheque)
      set((state) => ({
        cheques: [...state.cheques, newCheque],
        loading: false,
        backendConnected: true,
        error: null
      }))
      get().calculateStats()
      
      // Refresh clients if clientId provided
      if (cheque.clientId) {
        await get().fetchClients()
      }
    } catch (error: any) {
      console.error('Failed to add cheque:', error)
      
      // Handle duplicate key error
      if (error.response?.data?.error?.includes('duplicate key')) {
        set({ 
          loading: false, 
          error: 'Cheque number already exists',
          backendConnected: true 
        })
      } else {
        set({ 
          loading: false, 
          error: 'Failed to save to backend',
          backendConnected: false 
        })
      }
      throw error
    }
  },

  addCashTransaction: async (transaction) => {
    try {
      set({ loading: true, error: null })
      const newTransaction = await cashAPI.create(transaction)
      set((state) => ({
        cashTransactions: [...state.cashTransactions, newTransaction],
        loading: false,
        backendConnected: true,
        error: null
      }))
      get().calculateStats()
    } catch (error) {
      console.error('Failed to add cash transaction:', error)
      set({ 
        loading: false, 
        error: 'Failed to save to backend',
        backendConnected: false 
      })
      throw error
    }
  },

  addClient: async (client) => {
    try {
      set({ loading: true, error: null })
      const newClient = await clientAPI.create(client)
      set((state) => ({
        clients: [...state.clients, newClient],
        loading: false,
        backendConnected: true,
        error: null
      }))
    } catch (error) {
      console.error('Failed to add client:', error)
      set({ 
        loading: false, 
        error: 'Failed to save to backend',
        backendConnected: false 
      })
      throw error
    }
  },

  updateChequeStatus: async (id: string, status: string, bounceReason?: string) => {
    try {
      set({ loading: true, error: null })
      const updatedCheque = await chequeAPI.updateStatus(id, status, { bounceReason })
      
      set((state) => ({
        cheques: state.cheques.map(c => 
          c._id === id ? { ...c, status: status as any, bounceReason } : c
        ),
        loading: false,
        backendConnected: true,
        error: null
      }))
      
      get().calculateStats()
      await get().fetchClients()
    } catch (error) {
      console.error('Failed to update cheque status:', error)
      
      set((state) => ({
        cheques: state.cheques.map(c => 
          c._id === id ? { ...c, status: status as any } : c
        ),
        loading: false,
        error: 'Updated locally - Backend not connected',
        backendConnected: false
      }))
      
      get().calculateStats()
    }
  },

  refreshData: async () => {
    try {
      await get().fetchCheques()
      await get().fetchCashTransactions()
      await get().fetchClients()
      await get().fetchDashboardData()
      set({ 
        lastUpdated: new Date().toLocaleTimeString(),
        error: null 
      })
    } catch (error) {
      console.error('Failed to refresh data')
    }
  },

  initializeStore: async () => {
    const state = get()
    
    if (state.initialized || state.loading || state.isInitializing) {
      console.log('⏭️ Store already initialized or loading, skipping...')
      return
    }
    
    console.log('🔄 Initializing store...')
    set({ loading: true, isInitializing: true, error: null })
    
    try {
      await get().fetchCheques()
      await get().fetchCashTransactions()
      await get().fetchClients() // Won't fail even if route missing
      await get().fetchDashboardData()
      
      set({ 
        initialized: true,
        isInitializing: false,
        backendConnected: true,
        error: null,
        loading: false 
      })
      
      console.log('✅ Store initialized with backend data')
    } catch (error) {
      console.log('⚠️ Backend not available')
      set({ 
        initialized: true,
        isInitializing: false,
        backendConnected: false,
        error: null,
        loading: false,
        cheques: [],
        cashTransactions: [],
        clients: [],
        stats: {
          totalOutstanding: 0,
          pendingCheques: 0,
          clearedThisMonth: 0,
          bounceRate: 0,
        }
      })
    }
  },
}))