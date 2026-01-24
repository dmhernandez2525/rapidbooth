import { Router, Request, Response } from "express";
import {
  getAvailability,
  updateAvailability,
  getAvailableSlots,
  createBooking,
  confirmBooking,
  cancelBooking,
  getBookings,
  getBooking,
  getBookingByConfirmation,
} from "../services/schedulingService";

const router = Router();

// Get availability config for a site
router.get("/availability/:siteId", (req: Request, res: Response) => {
  try {
    const config = getAvailability(req.params.siteId);
    if (!config) {
      res.status(404).json({ error: "No availability configured" });
      return;
    }
    res.json({ availability: config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get availability";
    res.status(500).json({ error: message });
  }
});

// Update availability config
router.put("/availability/:siteId", (req: Request, res: Response) => {
  try {
    const config = updateAvailability(req.params.siteId, req.body);
    res.json({ availability: config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update availability";
    res.status(400).json({ error: message });
  }
});

// Get available time slots for a date
router.get("/slots/:siteId/:date", (req: Request, res: Response) => {
  try {
    const slots = getAvailableSlots(req.params.siteId, req.params.date);
    res.json({ slots, date: req.params.date, siteId: req.params.siteId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get slots";
    res.status(500).json({ error: message });
  }
});

// Create a booking
router.post("/bookings", (req: Request, res: Response) => {
  try {
    const { siteId, customerName, customerEmail, customerPhone, date, startTime, service, notes } = req.body;

    if (!siteId || !customerName || !customerEmail || !date || !startTime) {
      res.status(400).json({ error: "siteId, customerName, customerEmail, date, and startTime are required" });
      return;
    }

    const booking = createBooking({ siteId, customerName, customerEmail, customerPhone, date, startTime, service, notes });
    res.status(201).json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create booking";
    res.status(400).json({ error: message });
  }
});

// Get a specific booking
router.get("/bookings/:bookingId", (req: Request, res: Response) => {
  try {
    const booking = getBooking(req.params.bookingId);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get booking";
    res.status(500).json({ error: message });
  }
});

// Look up booking by confirmation code
router.get("/bookings/confirm/:code", (req: Request, res: Response) => {
  try {
    const booking = getBookingByConfirmation(req.params.code);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to look up booking";
    res.status(500).json({ error: message });
  }
});

// List bookings (optionally filtered by site and/or date)
router.get("/bookings", (req: Request, res: Response) => {
  try {
    const { siteId, date } = req.query;
    const bookingsList = getBookings(siteId as string | undefined, date as string | undefined);
    res.json({ bookings: bookingsList, total: bookingsList.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list bookings";
    res.status(500).json({ error: message });
  }
});

// Confirm a booking
router.post("/bookings/:bookingId/confirm", (req: Request, res: Response) => {
  try {
    const booking = confirmBooking(req.params.bookingId);
    res.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to confirm booking";
    res.status(400).json({ error: message });
  }
});

// Cancel a booking
router.post("/bookings/:bookingId/cancel", (req: Request, res: Response) => {
  try {
    const booking = cancelBooking(req.params.bookingId);
    res.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to cancel booking";
    res.status(400).json({ error: message });
  }
});

export default router;
