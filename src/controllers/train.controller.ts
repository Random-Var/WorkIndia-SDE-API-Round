import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const addTrains = async (req: Request, res: Response) => {
    const { name, source, destination, seats_total } = req.body;
    if (!name || !source || !destination || seats_total === undefined){
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    const seatsTotal = Number(seats_total);
    if (isNaN(seatsTotal) || seatsTotal <= 0) {
        res.status(400).json({ error: "Invalid seats_total value" });
        return;
    }

    const existingTrain = await prisma.train.findUnique({ where: { name } });
    if (existingTrain){
        res.status(409).json({ error: `Train named ${name} already exists` });
        return;
    }

    try{
        const newTrain = await prisma.train.create({
            data: { name, source, destination, seats_total:seatsTotal }
        });
        res.status(200).json({ message: "Train registered successfully" });
    }
    catch(error){
        res.status(500).json({ error: "Train creation failed" });
    }
}

export const getSeatAvailability = async (req: Request, res: Response) => {
    try {
        const { source, destination } = req.body;

        if (!source || !destination) {
            res.status(400).json({ error: "Source and destination are required" });
            return;
        }

        const trains = await prisma.train.findMany({
            where: { source, destination },
            select: {
                id: true,
                name: true,
                seats_total: true,
                seats_booked: true,
            }
        });

        if (trains.length === 0) {
            res.status(200).json({ message: "No trains found for this route", trains: [] });
            return;
        }

        const trainAvailability = trains.map(train => ({
            id: train.id,
            name: train.name,
            available_seats: train.seats_total - train.seats_booked
        }));

        res.status(200).json({ trains: trainAvailability });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch seat availability" });
    }
};
