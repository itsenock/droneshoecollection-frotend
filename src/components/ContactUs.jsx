
import './CoAbTePri.css';

const ContactUs = () => {
  return (
    <div className="contact-us">
      <h1>Contact Us</h1>
      <p>We’d love to hear from you! Please use the details below to get in touch or send us a message directly using the form.</p>
      
      {/* Contact Information Section */}
      <div className="contact-info">
        <h2>Contact Information</h2>
        <p><strong>Email:</strong> droneshoecollection@gmail.com</p>
        <p><strong>Phone:</strong> +254-111-654-524</p>
        <p><strong>Address:</strong> 123 Campus Street, Nairobi, Kenya</p>
      </div>

      {/* Contact Form Section */}
      <form
        className="contact-form"
        action="https://formspree.io/f/meooplbp" // Replace {your-form-id} with your Formspree ID
        method="POST"
      >
        <h2>Send Us a Message</h2>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your name"
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your email"
          required
        />
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder="Your message"
          required
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ContactUs;




