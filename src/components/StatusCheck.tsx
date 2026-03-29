import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Appointment } from '../lib/supabase';

export default function StatusCheck() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchMessage(null);
    setAppointments([]);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('phone_number', phoneNumber)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setSearchMessage({
          type: 'info',
          text: 'No appointments found with this phone number.',
        });
      } else {
        setAppointments(data);
        setSearchMessage({
          type: 'success',
          text: `Found ${data.length} appointment${data.length > 1 ? 's' : ''}.`,
        });
      }
    } catch (error) {
      setSearchMessage({
        type: 'error',
        text: 'Failed to search for appointments. Please try again.',
      });
      console.error('Error searching appointments:', error);
    } finally {
      setIsSearching(false);
    }
  };

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

  return (
    <div className="status-check-container">
      <div className="status-check-card">
        <h2>Check Appointment Status</h2>
        <p className="subtitle">Enter your phone number to view your appointment status</p>

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Check Status'}
          </button>
        </form>

        {searchMessage && (
          <div className={`message ${searchMessage.type}`}>
            {searchMessage.text}
          </div>
        )}

        {appointments.length > 0 && (
          <div className="appointments-list">
            <h3>Your Appointments</h3>
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <h4>{appointment.name}</h4>
                  <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="appointment-message">{appointment.message}</p>
                <p className="appointment-date">
                  Submitted: {new Date(appointment.created_at).toLocaleDateString()} at{' '}
                  {new Date(appointment.created_at).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
