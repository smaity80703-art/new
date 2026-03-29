import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            name: formData.name,
            phone_number: formData.phone_number,
            message: formData.message,
            status: 'Pending',
          },
        ]);

      if (error) throw error;

      setSubmitMessage({
        type: 'success',
        text: 'Your appointment request has been submitted successfully! You can check your status using your phone number.',
      });
      setFormData({ name: '', phone_number: '', message: '' });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Failed to submit appointment. Please try again.',
      });
      console.error('Error submitting appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form-card">
        <h2>Book an Appointment</h2>
        <p className="subtitle">We're here to support you on your journey to better mental health</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Tell us how we can help you..."
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>

        {submitMessage && (
          <div className={`message ${submitMessage.type}`}>
            {submitMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
