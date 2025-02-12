import { Request, Response } from "express";
import { prisma } from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET!


export const bookSeat = async (req: Request, res: Response) => {
    try {
        const { trainId } = req.params;
        const userId = req.body.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const train = await prisma.train.findUnique({ where: { id: Number(trainId) } });

        if (!train) {
            res.status(404).json({ error: "Train not found" });
            return;
        }

        if (train.seats_booked >= train.seats_total) {
            res.status(400).json({ error: "No available seats" });
            return;
        }

        await prisma.bookings.create({
            data: { userId: Number(userId), trainId: Number(trainId) }
        });

        await prisma.train.update({
            where: { id: Number(trainId) },
            data: { seats_booked: train.seats_booked + 1 }
        });

        res.status(201).json({ message: "Seat booked successfully" });
    } catch (error: any) {
        console.error("Error booking seat:", error);
        res.status(500).json({ error: "Booking failed", details: error.message });
    }
};

export const getBookingDetails = async (req: Request, res: Response) => {
    try {
        const { trainId } = req.params;
        const userId = req.body.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const booking = await prisma.bookings.findUnique({
            where: { userId_trainId: { userId: Number(userId), trainId: Number(trainId) } },
            include: {
                train: { select: { name: true, source: true, destination: true } }
            }
        });

        if (!booking) {
            res.status(404).json({ error: "No booking found for this train" });
            return;
        }

        res.status(200).json({
            trainId: booking.trainId,
            trainName: booking.train.name,
            source: booking.train.source,
            destination: booking.train.destination,
            message: "Booking details fetched successfully"
        });
    } catch (error: any) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ error: "Failed to fetch booking details", details: error.message });
    }
};
