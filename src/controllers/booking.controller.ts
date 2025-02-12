import { Request, Response } from "express";

export const bookTrain = async (req: Request, res: Response) => {
    console.log("Welcome to Book Trains.");
    res.status(200).json({ message: "OK" });
}

export const getBookingDetails = async (req: Request, res: Response) => {
    console.log("Welcome to Booking Details.");
    res.status(200).json({ message: "OK" });
}
