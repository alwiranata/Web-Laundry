import React from 'react'; // ⬅️ Tambahkan ini!
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode
}

export function PrivateRoute({ children }: Props) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/404" />;
}
