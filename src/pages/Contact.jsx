import React, { useState, useEffect } from 'react';
import './Contact.css';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Initialize EmailJS with your user ID
    emailjs.init('s36wETdvNMGlXRnI1'); // Replace with your actual EmailJS user ID
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Get current timestamp
      const currentTime = new Date().toLocaleString();
      // You'll need to replace these with your actual EmailJS credentials
      const result = await emailjs.send(
        'service_hi8orp2', // Replace with your EmailJS service ID
        'template_liex1w8', // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: 'noreply@annakolb.com',
          reply_to: formData.email,
          subject: formData.subject,
          message: formData.message,
          time: currentTime,
        //   to_email: 'anna@annakolb.com'
        },
        's36wETdvNMGlXRnI1' // Replace with your EmailJS user ID
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Email send error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        {/* <p>I promise I do not bite!</p> */}
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-section">
            <h2>Contact Information</h2>
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">anna@annakolb.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <span className="contact-value">+1 (317) 316-2125</span>
            </div>
            {/* <div className="contact-item">
              <span className="contact-label">Studio Address:</span>
              <span className="contact-value">123 Art Street, Creative District<br />City, State 12345</span>
            </div> */}
          </div>

          <div className="contact-section">
            <h2>Social Media</h2>
            <div className="contact-item">
              <span className="contact-label">Instagram:</span>
              <span className="contact-value">@annakolb.art</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Facebook:</span>
              <span className="contact-value">Anna Kolb Art</span>
            </div>
            {/* <div className="contact-item">
              <span className="contact-label">Twitter:</span>
              <span className="contact-value">@AnnaKolbArt</span>
            </div> */}
          </div>
{/* 
          <div className="contact-section">
            <h2>Business Hours</h2>
            <div className="contact-item">
              <span className="contact-label">Studio Hours:</span>
              <span className="contact-value">Tuesday - Saturday<br />10:00 AM - 6:00 PM</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Appointments:</span>
              <span className="contact-value">Available by request</span>
            </div>
          </div> */}
        </div>

        <div className="contact-form">
          <h2>Send a Message</h2>
          <form className="contact-form-content" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name" 
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com" 
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Commission, Collaboration, etc." 
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell me about your project or inquiry..." 
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && (
              <div className="success-message">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="error-message">
                Sorry, there was an error sending your message. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="back-home">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}

export default Contact;
