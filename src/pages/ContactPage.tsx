import React from 'react';
import { Calendar, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InlineTrustText } from '@/components/TrustSignals';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Talk to a Health Advisor
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Have questions? Need guidance? Our health advisors are here to help you make informed decisions about your premarital health screening.
        </p>
      </div>

      {/* Contact Options Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Schedule Call */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-center hover:border-primary transition-colors">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Schedule a Call</h3>
          <p className="text-sm text-slate-600 mb-4">
            Book a free 15-minute consultation
          </p>
          <a
            href="https://calendly.com/your-link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Book Now
          </a>
        </div>

        {/* Call Now */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-center hover:border-primary transition-colors">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Call Us</h3>
          <p className="text-sm text-slate-600 mb-4">
            Monday - Friday, 9 AM - 6 PM IST
          </p>
          <a
            href="tel:+911234567890"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            +91 12345 67890
          </a>
        </div>

        {/* WhatsApp */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-center hover:border-primary transition-colors">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
          <p className="text-sm text-slate-600 mb-4">
            Quick questions? Chat with us
          </p>
          <a
            href="https://wa.me/911234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Chat Now
          </a>
        </div>
      </div>

      {/* Email Form */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Send Us a Message</h3>
            <p className="text-sm text-slate-600">We'll respond within 24 hours</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              How can we help?
            </label>
            <textarea
              rows={5}
              placeholder="Tell us about your questions or concerns..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Trust Signals */}
      <div className="mt-12 text-center">
        <InlineTrustText />
        <p className="text-sm text-slate-400 mt-2">
          No spam, ever • Response within 24 hours
        </p>
        <Link
          to="/login"
          className="text-primary font-semibold hover:underline"
        >
          Or skip straight to signing up →
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;
