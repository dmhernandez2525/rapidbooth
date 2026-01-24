"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface FormData {
  name: string;
  email: string;
  business: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  business?: string;
  message?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.business.trim()) {
    errors.business = "Business name is required";
  }

  if (!data.message.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    business: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="pt-24 sm:pt-32">
        <section className="section-padding bg-gradient-to-b from-cream to-white min-h-[60vh] flex items-center">
          <div className="container-narrow text-center">
            <div className="w-16 h-16 rounded-full bg-forest-green/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-slate-blue mb-4">
              Message Sent!
            </h1>
            <p className="text-lg text-slate-blue-500 max-w-md mx-auto mb-8">
              Thank you for your interest in RapidBooth. We will get back to you
              within 24 hours.
            </p>
            <Button variant="outline" href="/">
              Back to Home
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-32">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-cream to-white">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-serif font-bold text-4xl sm:text-5xl text-slate-blue mb-4">
              Get in <span className="text-forest-green">Touch</span>
            </h1>
            <p className="text-lg text-slate-blue-500">
              Ready to build your website? Have questions? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-blue mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? "border-red-400" : "border-cream-300"
                      } bg-white text-slate-blue placeholder:text-slate-blue-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green transition-colors`}
                      placeholder="John Smith"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-blue mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-400" : "border-cream-300"
                      } bg-white text-slate-blue placeholder:text-slate-blue-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green transition-colors`}
                      placeholder="john@yourbusiness.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Business */}
                  <div>
                    <label
                      htmlFor="business"
                      className="block text-sm font-medium text-slate-blue mb-2"
                    >
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="business"
                      name="business"
                      value={formData.business}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.business ? "border-red-400" : "border-cream-300"
                      } bg-white text-slate-blue placeholder:text-slate-blue-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green transition-colors`}
                      placeholder="Your Business Name"
                    />
                    {errors.business && (
                      <p className="mt-1 text-sm text-red-500">{errors.business}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-blue mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.message ? "border-red-400" : "border-cream-300"
                      } bg-white text-slate-blue placeholder:text-slate-blue-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green transition-colors resize-none`}
                      placeholder="Tell us about your business and what you're looking for..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h3 className="font-serif font-bold text-lg text-slate-blue mb-4">
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-forest-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-slate-blue">Email</p>
                      <p className="text-sm text-slate-blue-500">hello@rapidbooth.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-forest-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-slate-blue">Response Time</p>
                      <p className="text-sm text-slate-blue-500">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-forest-green/5 border-forest-green/10">
                <h3 className="font-serif font-bold text-lg text-slate-blue mb-2">
                  Want a Demo?
                </h3>
                <p className="text-sm text-slate-blue-500 mb-4">
                  See RapidBooth in action. We will build a sample site for your
                  business type in real-time.
                </p>
                <Button variant="outline" size="sm" href="/features">
                  See Features
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
