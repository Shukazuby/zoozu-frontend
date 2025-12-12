"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { contactApi, type ContactInfo, type CreateContactDto } from "@/lib/api";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [infoError, setInfoError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateContactDto>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateContactDto, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch contact info on mount
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoadingInfo(true);
        setInfoError(null);
        const response = await contactApi.getContactInfo();
        if (response.success && response.data) {
          setContactInfo(response.data);
        } else {
          setInfoError("Failed to load contact information");
        }
      } catch (err: any) {
        console.error("Failed to fetch contact info:", err);
        setInfoError(err.response?.data?.message || "Failed to load contact information");
        // Set default values if API fails
        setContactInfo({
          email: "info@zoozu_ng.com",
          phone: "+234 706 820 9546",
          address: "123 Fashion Ave, Ikoyi, Lagos, Nigeria",
        });
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleInputChange = (field: keyof CreateContactDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setSubmitError(null);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CreateContactDto, string>> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await contactApi.submitMessage(formData);
      if (response.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError(response.message || "Failed to submit message. Please try again.");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to submit message. Please try again.";
      setSubmitError(errorMessage);
      
      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const backendErrors: Partial<Record<keyof CreateContactDto, string>> = {};
        const errors = err.response.data.errors;
        if (errors.name) backendErrors.name = errors.name;
        if (errors.email) backendErrors.email = errors.email;
        if (errors.message) backendErrors.message = errors.message;
        if (errors.subject) backendErrors.subject = errors.subject;
        setFormErrors(backendErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Default contact details if API fails or is loading
  const displayContactInfo = contactInfo || {
    email: "info@zoozu_ng.com",
    phone: "+234 706 820 9546",
    address: "123 Fashion Ave, Ikoyi, Lagos, Nigeria",
  };

  const contactDetails = [
    {
      label: "Email Us",
      value: displayContactInfo.email,
      icon: (
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5 text-yellow-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21.75 6.75-9.75 6-9.75-6m19.5 10.5-5.91-3.64M3.75 17.25l5.91-3.64m0 0 2.09-1.29 2.09 1.29"
          />
        </svg>
      ),
    },
    {
      label: "Call Us",
      value: displayContactInfo.phone,
      icon: (
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5 text-yellow-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.05a1.5 1.5 0 0 0-1.227-1.477l-3.123-.52a1.5 1.5 0 0 0-1.554.78l-.52.982a12.035 12.035 0 0 1-5.408-5.408l.982-.52a1.5 1.5 0 0 0 .78-1.554l-.52-3.123A1.5 1.5 0 0 0 8.55 3h-1.05A2.25 2.25 0 0 0 5.25 5.25v1.5Z"
          />
        </svg>
      ),
    },
    {
      label: "Our Address",
      value: displayContactInfo.address,
      icon: (
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5 text-yellow-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s6.75-4.686 6.75-10.125a6.75 6.75 0 1 0-13.5 0C5.25 16.314 12 21 12 21Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12.75a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="container">
        <div className="text-center space-y-3 mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-yellow-600">Get in touch</p>
          <h1 className="text-4xl font-semibold text-slate-900">Contact Us</h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our products,
            services, or anything else, our team is ready to answer all your inquiries.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitSuccess && (
                <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 border border-green-200">
                  <p className="font-semibold">Message sent successfully!</p>
                  <p className="mt-1">We'll get back to you as soon as possible.</p>
                </div>
              )}

              {submitError && (
                <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 border border-red-200">
                  <p className="font-semibold">Failed to send message</p>
                  <p className="mt-1">{submitError}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700 required">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  aria-required="true"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full rounded border px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-yellow-500 ${
                    formErrors.name ? "border-red-300" : "border-slate-200"
                  }`}
                  placeholder="Your Name"
                  type="text"
                  disabled={submitting}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-600" role="alert">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 required">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  aria-required="true"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full rounded border px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-yellow-500 ${
                    formErrors.email ? "border-red-300" : "border-slate-200"
                  }`}
                  placeholder="you@example.com"
                  disabled={submitting}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600" role="alert">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-slate-700">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className={`w-full rounded border px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-yellow-500 ${
                    formErrors.subject ? "border-red-300" : "border-slate-200"
                  }`}
                  placeholder="Inquiry about..."
                  type="text"
                  disabled={submitting}
                />
                {formErrors.subject && (
                  <p className="text-xs text-red-600" role="alert">
                    {formErrors.subject}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-700 required">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  aria-required="true"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className={`min-h-[120px] w-full rounded border px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-yellow-500 ${
                    formErrors.message ? "border-red-300" : "border-slate-200"
                  }`}
                  placeholder="Type your message here..."
                  disabled={submitting}
                />
                {formErrors.message && (
                  <p className="text-xs text-red-600" role="alert">
                    {formErrors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded bg-yellow-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Direct Contact</h2>
            {loadingInfo ? (
              <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 animate-pulse rounded bg-slate-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                      <div className="h-4 w-48 animate-pulse rounded bg-slate-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : infoError ? (
              <div className="rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-800 border border-yellow-200">
                <p>{infoError}</p>
                <p className="mt-1 text-xs">Showing default contact information.</p>
              </div>
            ) : null}
            
            <div className="space-y-5">
              {contactDetails.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="mt-1">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-sm text-slate-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-8 h-px w-full bg-slate-100" />
            
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">Chat with us on WhatsApp</p>
              <a
                href={`https://wa.me/${displayContactInfo.whatsapp?.replace(/[^0-9]/g, '') || displayContactInfo.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                <span aria-hidden>💬</span> Start a Chat
              </a>
            </div>

            {contactInfo?.socialLinks && (
              <>
                <div className="my-8 h-px w-full bg-slate-100" />
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-800">Follow Us</p>
                  <div className="flex gap-3">
                    {contactInfo.socialLinks.facebook && (
                      <a
                        href={contactInfo.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-yellow-100 hover:text-yellow-700"
                        aria-label="Facebook"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )}
                    {contactInfo.socialLinks.instagram && (
                      <a
                        href={contactInfo.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-yellow-100 hover:text-yellow-700"
                        aria-label="Instagram"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    )}
                    {contactInfo.socialLinks.twitter && (
                      <a
                        href={contactInfo.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-yellow-100 hover:text-yellow-700"
                        aria-label="Twitter"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    )}
                    {contactInfo.socialLinks.linkedin && (
                      <a
                        href={contactInfo.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-yellow-100 hover:text-yellow-700"
                        aria-label="LinkedIn"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
