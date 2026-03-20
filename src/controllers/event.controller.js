import Event from "../models/event.model.js";
import { generateEventPlan } from "../services/ai.service.js";

export const createEvent = async (req, res) => {
    try {
        const { query, response } = req.body ?? {};

        if (!query || response === undefined) {
            return res
                .status(400)
                .json({ message: "Request body must include 'query' and 'response' fields" });
        }

        console.log("Creating event for user:", req.user._id);
        console.log("Query:", query);
        console.log("Response:", response);

        const event = await Event.create({
            user: req.user._id,
            query,
            response,
        });

        res.json({
            success: true,
            data: event,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user._id }).sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            data: events,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const generateEvent = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || query.length < 5) {
            return res.status(400).json({
                message: "Query must be at least 5 characters",
            });
        }

        const aiResponse = await generateEventPlan(query);

        const event = await Event.create({
            user: req.user._id,
            query,
            response: aiResponse,
        });

        res.json({
            success: true,
            data: event,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};