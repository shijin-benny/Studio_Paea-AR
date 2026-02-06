'use client';

import { useState, useMemo, useCallback } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Memoize email regex to avoid recreating on each render
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validateEmail = useCallback((email: string): boolean => {
    return emailRegex.test(email);
  }, [emailRegex]);

  const validateField = useCallback((name: string, value: string): string => {
    const trimmedValue = value.trim();
    switch (name) {
      case 'email':
        if (!trimmedValue) return 'Email is required';
        if (!validateEmail(trimmedValue)) return 'Please enter a valid email address';
        return '';
      case 'firstName':
        if (!trimmedValue) return 'First name is required';
        if (trimmedValue.length < 2) return 'First name must be at least 2 characters';
        return '';
      case 'lastName':
        if (!trimmedValue) return 'Last name is required';
        if (trimmedValue.length < 2) return 'Last name must be at least 2 characters';
        return '';
      case 'message':
        if (!trimmedValue) return 'Message is required';
        if (trimmedValue.length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  }, [validateEmail]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitStatus('idle');

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitStatus('success');
      setFormData({ email: '', firstName: '', lastName: '', message: '' });
      setErrors({});
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateField]);

  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col" style={{ position: 'relative', zIndex: 1 }}>

      {/* Main content — Single page, no scroll */}
      <div className="flex-1 px-4 sm:px-6 md:px-12 pt-20 pb-20 sm:pt-24 sm:pb-8 md:pt-20 md:pb-8 flex items-center overflow-auto bg-gradient-to-br from-white via-neutral-50/30 to-white">
        <div className="max-w-7xl mx-auto w-full h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-32 items-start lg:items-center w-full">
            {/* Left Column — Contact Information — Modern & Elegant */}
            <div className="flex flex-col justify-center items-start gap-8 sm:gap-10 md:gap-12 text-neutral-900 order-2 lg:order-1">
              <div className="space-y-1 group w-full">
                <div className="text-[8px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.25em] uppercase text-neutral-500 mb-2 sm:mb-3">
                  Email
                </div>
                <a 
                  href="mailto:hello@studiopaea.com" 
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans font-medium tracking-wide hover:text-neutral-600 transition-all duration-300 block group-hover:translate-x-1 break-all sm:break-normal"
                >
                  hello@studiopaea.com
                </a>
              </div>
              
              <div className="space-y-1 group w-full">
                <div className="text-[8px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.25em] uppercase text-neutral-500 mb-2 sm:mb-3">
                  Phone
                </div>
                <a 
                  href="tel:+1234567890" 
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans font-medium tracking-wide hover:text-neutral-600 transition-all duration-300 block group-hover:translate-x-1"
                >
                  +1 234 567 890
                </a>
              </div>
              
              <div className="space-y-1 pt-1 w-full">
                <div className="text-[8px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.25em] uppercase text-neutral-500 mb-2 sm:mb-3">
                  Address
                </div>
                <div className="text-sm sm:text-base md:text-lg font-normal tracking-wide text-neutral-600 leading-relaxed space-y-0.5 sm:space-y-1">
                  <p>123 design street</p>
                  <p>creative district, suite 500</p>
                  <p>new york ny 10001</p>
                  <p className="mt-1 sm:mt-2 text-neutral-800 font-medium">united states</p>
                </div>
              </div>
              
              <div className="pt-4 sm:pt-6 w-full">
                <div className="text-[8px] sm:text-[9px] md:text-[10px] font-medium tracking-[0.25em] uppercase text-neutral-500 mb-3 sm:mb-4">
                  Follow Us
                </div>
                <div className="flex items-center gap-5 sm:gap-6">
                  {/* Instagram */}
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors duration-300"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors duration-300"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors duration-300"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column — Contact Form — Modern & Refined */}
            <div className="bg-gradient-to-br from-white via-neutral-50/40 to-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center shadow-[0_25px_70px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)] border border-neutral-200/60 relative overflow-hidden order-1 lg:order-2">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neutral-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-neutral-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-7 relative z-10">
                {/* Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-[8px] md:text-[9px] font-medium tracking-[0.25em] uppercase text-neutral-500 mb-2.5 group-focus-within:text-neutral-700 transition-colors">
                    email <span className="text-neutral-400 font-normal normal-case tracking-normal">(required)</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full bg-transparent border-0 border-b focus:outline-none pb-2.5 text-neutral-900 text-sm md:text-base font-normal tracking-wide transition-all duration-300 placeholder:text-neutral-400 placeholder:font-light placeholder:text-sm ${
                      errors.email 
                        ? 'border-red-400 focus:border-red-600' 
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-light">{errors.email}</p>
                  )}
                </div>

                {/* Name Fields — Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
                  <div className="group">
                    <label htmlFor="firstName" className="block text-[8px] md:text-[9px] font-medium tracking-[0.25em] uppercase text-neutral-500 mb-2.5 group-focus-within:text-neutral-700 transition-colors">
                      first name <span className="text-neutral-400 font-normal normal-case tracking-normal">(required)</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full bg-transparent border-0 border-b focus:outline-none pb-2.5 text-neutral-900 text-sm md:text-base font-normal tracking-wide transition-all duration-300 placeholder:text-neutral-400 placeholder:font-light placeholder:text-sm ${
                        errors.firstName 
                          ? 'border-red-400 focus:border-red-600' 
                          : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                      placeholder=""
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500 font-light">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="group">
                    <label htmlFor="lastName" className="block text-[8px] md:text-[9px] font-medium tracking-[0.25em] uppercase text-neutral-500 mb-2.5 group-focus-within:text-neutral-700 transition-colors">
                      last name <span className="text-neutral-400 font-normal normal-case tracking-normal">(required)</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full bg-transparent border-0 border-b focus:outline-none pb-2.5 text-neutral-900 text-sm md:text-base font-normal tracking-wide transition-all duration-300 placeholder:text-neutral-400 placeholder:font-light placeholder:text-sm ${
                        errors.lastName 
                          ? 'border-red-400 focus:border-red-600' 
                          : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                      placeholder=""
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-500 font-light">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="group">
                  <label htmlFor="message" className="block text-[8px] md:text-[9px] font-medium tracking-[0.25em] uppercase text-neutral-500 mb-2.5 group-focus-within:text-neutral-700 transition-colors">
                    message <span className="text-neutral-400 font-normal normal-case tracking-normal">(required)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    rows={4}
                    className={`w-full bg-transparent border-0 border-b focus:outline-none pb-2.5 text-neutral-900 text-sm md:text-base font-normal tracking-wide resize-none transition-all duration-300 min-h-[90px] placeholder:text-neutral-400 placeholder:font-light placeholder:text-sm ${
                      errors.message 
                        ? 'border-red-400 focus:border-red-600' 
                        : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500 font-light">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-neutral-900 text-white px-10 py-3.5 rounded-xl text-xs md:text-sm font-medium tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] w-full md:w-auto"
                  >
                    {isSubmitting ? 'sending...' : 'send'}
                  </button>
                  
                  {submitStatus === 'success' && (
                    <p className="mt-3 text-xs text-green-600 font-normal animate-in fade-in-0">
                      Thank you! Your message has been sent successfully.
                    </p>
                  )}
                  
                  {submitStatus === 'error' && (
                    <p className="mt-3 text-xs text-red-600 font-normal animate-in fade-in-0">
                      {errorMessage || 'Something went wrong. Please try again.'}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
