import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  'pending_payment',
  'payment_confirmed',
  'measurement_scheduled',
  'measurement_completed',
  'in_production',
  'ready_for_delivery',
  'delivery_scheduled',
  'installation_scheduled',
  'installation_completed',
  'completed',
  'cancelled',
  'refunded'
];

const AdminOrders = () => {
  const { isAuthenticated, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || (!isAdmin && !isManager)) {
      navigate('/');
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getAllOrders();
        setOrders(response.data.orders);
      } catch (err) {
        setError('Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, isAdmin, isManager, navigate]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, status } : o)));
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  if (!isAuthenticated || (!isAdmin && !isManager)) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Carregando...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <h1 className="text-2xl mb-6 font-light tracking-wide">Pedidos</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-stone-200">
          <thead>
            <tr className="bg-stone-100 text-left text-stone-600">
              <th className="p-3 border-b">Pedido</th>
              <th className="p-3 border-b">Cliente</th>
              <th className="p-3 border-b">Total</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Atualizar</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b">
                <td className="p-3">{order.orderNumber}</td>
                <td className="p-3">{order.customer?.firstName || order.customerInfo?.firstName}</td>
                <td className="p-3">€ {order.totals.total}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className="border border-stone-300 p-2"
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
