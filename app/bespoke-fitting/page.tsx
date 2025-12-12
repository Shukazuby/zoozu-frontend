"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { bespokeFittingsApi, tokenManager, usersApi, type CreateBespokeFittingDto, type User } from "@/lib/api";

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

// Helper function to generate dates for a specific month
function generateDates(year: number, month: number) {
  const dates: Array<[string, string]> = [];
  
  // Get first day of the month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = firstDay.getDay();
  
  // Add empty cells for days before the first day of the month
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  for (let i = 0; i < startDayOfWeek; i++) {
    dates.push(["", ""]);
  }
  
  // Generate dates for the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    const dayName = dayNames[date.getDay()];
    dates.push([dayName, i.toString()]);
  }
  
  return dates;
}

// Helper function to format date for API (YYYY-MM-DD)
function formatDateForAPI(year: number, month: number, day: number): string {
  const date = new Date(year, month, day);
  return date.toISOString().split('T')[0];
}

export default function BespokeFittingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateBespokeFittingDto>({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    timeSlot: "",
    specificRequests: "",
  });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>(timeSlots);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const today = new Date();
  const [displayMonth, setDisplayMonth] = useState<number>(today.getMonth());
  const [displayYear, setDisplayYear] = useState<number>(today.getFullYear());
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const dates = generateDates(displayYear, displayMonth);
  
  const handlePreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
    // Clear selected date when changing months
    setSelectedDate("");
    setSelectedTimeSlot("");
    setFormData((prev) => ({ ...prev, date: "", timeSlot: "" }));
  };
  
  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
    // Clear selected date when changing months
    setSelectedDate("");
    setSelectedTimeSlot("");
    setFormData((prev) => ({ ...prev, date: "", timeSlot: "" }));
  };

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      if (!tokenManager.isAuthenticated()) {
        router.push(`/auth/login?next=${encodeURIComponent("/bespoke-fitting")}`);
        return;
      }
      
      // Load user profile to prefill form
      try {
        const response = await usersApi.getProfile();
        if (response.success && response.data) {
          const userData = response.data as User;
          setUser(userData);
          setFormData((prev) => ({
            ...prev,
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };
    
    checkAuth();
  }, [router]);

  // Load available slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    setError(null);
    try {
      const response = await bespokeFittingsApi.getAvailableSlots(date);
      if (response.success && response.data) {
        setAvailableSlots(response.data.availableSlots || timeSlots);
      }
    } catch (err: any) {
      console.error("Failed to load available slots:", err);
      // Don't show error, just use all slots as available
      setAvailableSlots(timeSlots);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = (day: string) => {
    const dayNum = parseInt(day, 10);
    if (isNaN(dayNum)) return;
    
    const selectedDateStr = formatDateForAPI(displayYear, displayMonth, dayNum);
    setSelectedDate(selectedDateStr);
    setFormData((prev) => ({ ...prev, date: selectedDateStr }));
    setSelectedTimeSlot(""); // Reset time slot when date changes
  };
  
  // Check if a date is in the past
  const isDatePast = (day: string): boolean => {
    const dayNum = parseInt(day, 10);
    if (isNaN(dayNum)) return false;
    
    const dateToCheck = new Date(displayYear, displayMonth, dayNum);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateToCheck < todayStart;
  };

  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
    setFormData((prev) => ({ ...prev, timeSlot: slot }));
  };

  const handleInputChange = (field: keyof CreateBespokeFittingDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenManager.isAuthenticated()) {
      router.push(`/auth/login?next=${encodeURIComponent("/bespoke-fitting")}`);
      return;
    }

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.date || !formData.timeSlot) {
      setError("Please fill in all required fields (Full Name, Email, Phone, Date, and Time Slot)");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await bespokeFittingsApi.create(formData);
      
      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          fullName: user?.fullName || "",
          email: user?.email || "",
          phone: user?.phone || "",
          date: "",
          timeSlot: "",
          specificRequests: "",
        });
        setSelectedDate("");
        setSelectedTimeSlot("");
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      } else {
        setError(response.message || "Failed to book fitting appointment");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to book fitting appointment. Please try again.";
      setError(errorMessage);
      console.error("Fitting booking error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-slate-50 pb-16 pt-12">
        <div className="container">
          <div className="rounded-lg bg-white p-8 shadow-sm text-center">
            <div className="mb-4 text-4xl">✓</div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Fitting Appointment Booked!</h2>
            <p className="text-slate-600 mb-4">
              Your fitting appointment has been confirmed. We'll contact you within 1 business day to finalize details.
            </p>
            <Link href="/profile" className="text-yellow-700 hover:text-yellow-600 font-semibold">
              View your appointments →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="container space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-slate-900">Book Your Bespoke Fitting</h1>
          <p className="text-base text-slate-600 max-w-3xl mx-auto">
            Experience the pinnacle of custom luxury with a personalized fitting session. Our expert
            tailors will guide you through fabric selection, measurements, and design, ensuring your
            garment is a true reflection of your style.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Select a Date</h2>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-4">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="rounded border border-slate-200 px-3 py-1 transition hover:border-yellow-500 hover:bg-yellow-50"
                aria-label="Previous month"
              >
                ‹
              </button>
              <span>{monthNames[displayMonth]} {displayYear}</span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="rounded border border-slate-200 px-3 py-1 transition hover:border-yellow-500 hover:bg-yellow-50"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-sm">
              {dates.map(([day, date], index) => {
                if (!date) {
                  // Empty cell for days before the first day of the month
                  return <div key={`empty-${index}`} className="h-16" />;
                }
                
                const dayNum = parseInt(date, 10);
                const dateStr = formatDateForAPI(displayYear, displayMonth, dayNum);
                const isSelected = selectedDate === dateStr;
                const isPast = isDatePast(date);
                
                return (
                  <button
                    key={`${day}-${date}-${displayMonth}-${displayYear}`}
                    type="button"
                    onClick={() => !isPast && handleDateSelect(date)}
                    disabled={isPast}
                    className={`flex h-16 flex-col items-center justify-center rounded border transition ${
                      isSelected
                        ? "bg-yellow-500 border-yellow-500 font-semibold text-white"
                        : isPast
                        ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white border-slate-200 text-slate-800 hover:border-yellow-500"
                    }`}
                  >
                    <span className="text-xs text-slate-500">{day}</span>
                    <span>{date}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">Choose Time Slot</h3>
              {loadingSlots ? (
                <p className="text-sm text-slate-500">Loading available slots...</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {timeSlots.map((slot) => {
                    const isAvailable = availableSlots.includes(slot);
                    const isSelected = selectedTimeSlot === slot;
                    
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => isAvailable && handleTimeSlotSelect(slot)}
                        disabled={!isAvailable}
                        className={`rounded border px-3 py-2 transition ${
                          isSelected
                            ? "border-yellow-500 bg-yellow-500 font-semibold text-white"
                            : !isAvailable
                            ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "border-slate-200 text-slate-800 hover:border-yellow-500"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="text-yellow-600" aria-hidden>
                ✨
              </span>
              Fitting Concierge
            </div>
            <p className="text-sm text-slate-700">
              A dedicated stylist will confirm your slot, tailor the session to your goals, and guide fabric and silhouette selections ahead of time.
            </p>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">What we&apos;ll prep for you</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span aria-hidden>•</span> Curated fabric swatches based on your style notes
                </li>
                <li className="flex gap-2">
                  <span aria-hidden>•</span> Measurement check and fit preferences
                </li>
                <li className="flex gap-2">
                  <span aria-hidden>•</span> Occasion-specific looks (formal, cultural, or casual)
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-100 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">Contact Information</p>
              
              {error && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 required">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 required">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 required">Phone</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">Share a quick note</p>
                <textarea
                  value={formData.specificRequests || ""}
                  onChange={(e) => handleInputChange("specificRequests", e.target.value)}
                  className="min-h-[100px] w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                  placeholder="Tell us about the event, palette, fit preferences, or any inspiration links."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="submit"
                  disabled={submitting || !selectedDate || !selectedTimeSlot}
                  className="rounded bg-yellow-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Booking..." : "Send to Stylist"}
                </button>
                <Link
                  href="/contact"
                  className="rounded border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 text-center transition hover:border-yellow-500"
                >
                  Call the Atelier
                </Link>
              </div>
              <p className="text-xs text-slate-500">
                We&apos;ll confirm within 1 business day and share a brief fitting plan before your appointment.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
