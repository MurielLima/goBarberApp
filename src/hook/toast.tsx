import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';
import ToastContainer from '../components/ToastContainer';
import { uuid } from 'uuidv4';

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}
export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'error';
}

const ToastContext = createContext({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ title, description, type }: Omit<ToastMessage, 'id'>) => {
      const toastMessage = {
        id: uuid(),
        title,
        description,
        type,
      };
      setMessages(state => [...state, toastMessage]);
      console.log('addToast');
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    console.log('remove');
    setMessages(state => state.filter(message => message.id != id));
  }, []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const toastContext = useContext(ToastContext);
  if (!toastContext) {
    throw new Error('useToast must be used within an ToastContext');
  }
  return toastContext;
}
export { ToastContext, ToastProvider, useToast };
