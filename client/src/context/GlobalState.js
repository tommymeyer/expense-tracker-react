import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';


// Initial state
const initialState = {
  error: null,
  loading: true,
  transactions: []
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  async function getTransactions() {
    try {
      const res = await axios.get('/api/v1/transactions');

      dispatch({
        payload: res.data.data,
        type: 'GET_TRANSACTIONS'
      });
    } catch (err) {
      dispatch({
        payload: err.response.data.error,
        type: 'TRANSACTION_ERROR'
      });
    }
  }
  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.post('/api/v1/transactions', transaction, config);

      dispatch({
        payload: res.data.data,
        type: 'ADD_TRANSACTION'
      });
    } catch (err) {
      dispatch({
        payload: err.response.data.error,
        type: 'TRANSACTION_ERROR'
      });
    }
  }

  async function deleteTransaction(id) {
    try {
      await axios.delete(`/api/v1/transactions/${id}`);

      dispatch({
        payload: id,
        type: 'DELETE_TRANSACTION'
      });
    } catch (err) {
      dispatch({
        payload: err.response.data.error,
        type: 'TRANSACTION_ERROR'
      });
    }
  }

  return (
    <GlobalContext.Provider value={{
      addTransaction,
      deleteTransaction,
      error: state.error,
      getTransactions,
      loading: state.loading,
      transactions: state.transactions
    }}>
      {children}
    </GlobalContext.Provider>
  )
}
