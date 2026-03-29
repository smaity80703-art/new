import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Appointment } from '../lib/supabase';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Accepted' | 'Rejected'>('All');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showMessage('error', 'Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: 'Accepted' | 'Rejected') => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.map(apt =>
        apt.id === id ? { ...apt, status, updated_at: new Date().toISOString() } : apt
      ));
      showMessage('success', `Appointment ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      showMessage('error', 'Failed to update appointment status');
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.filter(apt => apt.id !== id));
      showMessage('success', 'Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showMessage('error', 'Failed to delete appointment');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    onLogout();
  };

  const filteredAppointments = filterStatus === 'All'
    ? appointments
    : appointments.filter(apt => apt.status === filterStatus);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'status-accepted';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const getStatusCount = (status: string) => {
    return appointments.filter(apt => apt.status === status).length;
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage appointment requests</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {actionMessage && (
        <div className={`message ${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}

      <div className="stats-container">
        <div className="stat-card">
          <h3>{appointments.length}</h3>
          <p>Total Appointments</p>
        </div>
        <div className="stat-card pending">
          <h3>{getStatusCount('Pending')}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card accepted">
          <h3>{getStatusCount('Accepted')}</h3>
          <p>Accepted</p>
        </div>
        <div className="stat-card rejected">
          <h3>{getStatusCount('Rejected')}</h3>
          <p>Rejected</p>
        </div>
      </div>

      <div className="filter-container">
        <label>Filter by status:</label>
        <div className="filter-buttons">
          {(['All', 'Pending', 'Accepted', 'Rejected'] as const).map(status => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading appointments...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="no-appointments">No appointments found</div>
      ) : (
        <div className="appointments-grid">
          {filteredAppointments.map(appointment => (
            <div key={appointment.id} className="appointment-card admin">
              <div className="appointment-header">
                <div>
                  <h3>{appointment.name}</h3>
                  <p className="phone">{appointment.phone_number}</p>
                </div>
                <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>

              <p className="appointment-message">{appointment.message}</p>

              <div className="appointment-meta">
                <p className="date">
                  Submitted: {new Date(appointment.created_at).toLocaleDateString()} at{' '}
                  {new Date(appointment.created_at).toLocaleTimeString()}
                </p>
                {appointment.updated_at !== appointment.created_at && (
                  <p className="date">
                    Updated: {new Date(appointment.updated_at).toLocaleDateString()} at{' '}
                    {new Date(appointment.updated_at).toLocaleTimeString()}
                  </p>
                )}
              </div>

              <div className="appointment-actions">
                {appointment.status !== 'Accepted' && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, 'Accepted')}
                    className="action-btn accept"
                  >
                    Accept
                  </button>
                )}
                {appointment.status !== 'Rejected' && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, 'Rejected')}
                    className="action-btn reject"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => deleteAppointment(appointment.id)}
                  className="action-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
