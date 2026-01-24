import crypto from "crypto";

export type BookingStatus = "pending" | "confirmed" | "canceled" | "completed";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

const MIN_SLOT_DURATION = 5; // minutes
const MAX_BOOKINGS = 5000;

export interface TimeSlot {
  start: string; // HH:MM
  end: string;
}

export interface AvailabilityConfig {
  siteId: string;
  businessName: string;
  timezone: string;
  slotDuration: number; // minutes
  bufferTime: number; // minutes between appointments
  schedule: Record<DayOfWeek, TimeSlot[] | null>; // null = closed
  blockedDates: string[]; // ISO date strings
}

export interface Booking {
  id: string;
  siteId: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string; // ISO date
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  service?: string;
  notes?: string;
  status: BookingStatus;
  confirmationCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface CreateBookingRequest {
  siteId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  startTime: string;
  service?: string;
  notes?: string;
}

const availabilityConfigs = new Map<string, AvailabilityConfig>();
const bookings = new Map<string, Booking>();

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function generateConfirmationCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

// Seed demo data
function seedSchedulingData(): void {
  if (availabilityConfigs.size > 0) return;

  const defaultSchedule: Record<DayOfWeek, TimeSlot[] | null> = {
    monday: [{ start: "09:00", end: "17:00" }],
    tuesday: [{ start: "09:00", end: "17:00" }],
    wednesday: [{ start: "09:00", end: "17:00" }],
    thursday: [{ start: "09:00", end: "17:00" }],
    friday: [{ start: "09:00", end: "17:00" }],
    saturday: [{ start: "10:00", end: "14:00" }],
    sunday: null,
  };

  availabilityConfigs.set("site_summit", {
    siteId: "site_summit",
    businessName: "Summit Plumbing & HVAC",
    timezone: "America/Denver",
    slotDuration: 60,
    bufferTime: 15,
    schedule: { ...defaultSchedule, saturday: [{ start: "08:00", end: "12:00" }] },
    blockedDates: ["2026-01-01", "2026-01-20"],
  });

  availabilityConfigs.set("site_dental", {
    siteId: "site_dental",
    businessName: "Clearview Family Dental",
    timezone: "America/Chicago",
    slotDuration: 30,
    bufferTime: 10,
    schedule: { ...defaultSchedule, saturday: [{ start: "09:00", end: "14:00" }] },
    blockedDates: ["2026-01-01"],
  });

  // Demo bookings
  const demoBookings: Omit<Booking, "id" | "confirmationCode" | "createdAt" | "updatedAt">[] = [
    { siteId: "site_summit", businessName: "Summit Plumbing & HVAC", customerName: "Alice Johnson", customerEmail: "alice@example.com", customerPhone: "(303) 555-1234", date: "2026-01-27", startTime: "09:00", endTime: "10:00", service: "Plumbing Repair", status: "confirmed" },
    { siteId: "site_summit", businessName: "Summit Plumbing & HVAC", customerName: "Bob Williams", customerEmail: "bob@example.com", date: "2026-01-27", startTime: "10:15", endTime: "11:15", service: "HVAC Maintenance", status: "confirmed" },
    { siteId: "site_summit", businessName: "Summit Plumbing & HVAC", customerName: "Carol Davis", customerEmail: "carol@example.com", date: "2026-01-28", startTime: "14:00", endTime: "15:00", service: "Emergency Repair", status: "pending" },
    { siteId: "site_dental", businessName: "Clearview Family Dental", customerName: "David Lee", customerEmail: "david@example.com", customerPhone: "(555) 999-0000", date: "2026-01-27", startTime: "09:00", endTime: "09:30", service: "Cleaning", status: "confirmed" },
    { siteId: "site_dental", businessName: "Clearview Family Dental", customerName: "Emma Wilson", customerEmail: "emma@example.com", date: "2026-01-28", startTime: "10:00", endTime: "10:30", service: "Consultation", status: "confirmed" },
  ];

  demoBookings.forEach((b) => {
    const id = generateId("bk");
    const now = new Date().toISOString();
    bookings.set(id, { ...b, id, confirmationCode: generateConfirmationCode(), createdAt: now, updatedAt: now });
  });
}

seedSchedulingData();

function getDayOfWeek(dateStr: string): DayOfWeek {
  const days: DayOfWeek[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const d = new Date(dateStr + "T12:00:00");
  return days[d.getDay()];
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function getAvailability(siteId: string): AvailabilityConfig | undefined {
  return availabilityConfigs.get(siteId);
}

export function updateAvailability(siteId: string, updates: Partial<AvailabilityConfig>): AvailabilityConfig {
  const existing = availabilityConfigs.get(siteId);
  if (!existing) throw new Error("Availability config not found");

  if (updates.slotDuration !== undefined && updates.slotDuration < MIN_SLOT_DURATION) {
    throw new Error(`slotDuration must be at least ${MIN_SLOT_DURATION} minutes`);
  }
  if (updates.bufferTime !== undefined && updates.bufferTime < 0) {
    throw new Error("bufferTime must be non-negative");
  }

  const updated = { ...existing, ...updates, siteId };
  availabilityConfigs.set(siteId, updated);
  return updated;
}

export function getAvailableSlots(siteId: string, date: string): AvailableSlot[] {
  const config = availabilityConfigs.get(siteId);
  if (!config) return [];

  // Guard against infinite loop: enforce minimum slot duration
  const slotDuration = Math.max(config.slotDuration, MIN_SLOT_DURATION);
  const bufferTime = Math.max(config.bufferTime, 0);

  const dayOfWeek = getDayOfWeek(date);
  const daySchedule = config.schedule[dayOfWeek];
  if (!daySchedule) return [];

  if (config.blockedDates.includes(date)) return [];

  const existingBookings = Array.from(bookings.values())
    .filter((b) => b.siteId === siteId && b.date === date && b.status !== "canceled");

  const slots: AvailableSlot[] = [];

  for (const window of daySchedule) {
    let current = timeToMinutes(window.start);
    const windowEnd = timeToMinutes(window.end);

    while (current + slotDuration <= windowEnd) {
      const startTime = minutesToTime(current);
      const endTime = minutesToTime(current + slotDuration);

      const isBooked = existingBookings.some((b) => {
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime) + bufferTime;
        return current < bEnd && current + slotDuration > bStart;
      });

      slots.push({ date, startTime, endTime, available: !isBooked });
      current += slotDuration + bufferTime;
    }
  }

  return slots;
}

export function createBooking(request: CreateBookingRequest): Booking {
  if (bookings.size >= MAX_BOOKINGS) {
    throw new Error("Maximum bookings reached");
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.customerEmail)) {
    throw new Error("Invalid email address");
  }

  const config = availabilityConfigs.get(request.siteId);
  if (!config) throw new Error("No availability configured for this site");

  const slots = getAvailableSlots(request.siteId, request.date);
  const matchingSlot = slots.find((s) => s.startTime === request.startTime && s.available);
  if (!matchingSlot) throw new Error("Selected time slot is not available");

  const now = new Date().toISOString();
  const booking: Booking = {
    id: generateId("bk"),
    siteId: request.siteId,
    businessName: config.businessName,
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    customerPhone: request.customerPhone,
    date: request.date,
    startTime: matchingSlot.startTime,
    endTime: matchingSlot.endTime,
    service: request.service,
    notes: request.notes,
    status: "pending",
    confirmationCode: generateConfirmationCode(),
    createdAt: now,
    updatedAt: now,
  };

  bookings.set(booking.id, booking);
  return booking;
}

export function confirmBooking(bookingId: string): Booking {
  const booking = bookings.get(bookingId);
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "pending") throw new Error("Can only confirm pending bookings");
  booking.status = "confirmed";
  booking.updatedAt = new Date().toISOString();
  return booking;
}

export function cancelBooking(bookingId: string): Booking {
  const booking = bookings.get(bookingId);
  if (!booking) throw new Error("Booking not found");
  if (booking.status === "canceled") throw new Error("Booking is already canceled");
  booking.status = "canceled";
  booking.updatedAt = new Date().toISOString();
  return booking;
}

export function getBookings(siteId?: string, date?: string): Booking[] {
  let result = Array.from(bookings.values());
  if (siteId) result = result.filter((b) => b.siteId === siteId);
  if (date) result = result.filter((b) => b.date === date);
  return result.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
}

export function getBooking(bookingId: string): Booking | undefined {
  return bookings.get(bookingId);
}

export function getBookingByConfirmation(code: string): Booking | undefined {
  return Array.from(bookings.values()).find((b) => b.confirmationCode === code);
}
