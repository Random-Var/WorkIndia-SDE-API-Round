import { Request, Response } from "express";

export const addTrains = async (req: Request, res: Response) => {
    console.log("Welcome to Add Trains.");
    res.status(200).json({ message: "OK" });
}

export const getTrainAvailability = async (req: Request, res: Response) => {
    console.log("Welcome to Train Availability.");
    res.status(200).json({ message: "OK" });
}
