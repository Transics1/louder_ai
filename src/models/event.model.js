import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        query: {
            type: String,
            required: true,
        },
        response: Object,
    },
    { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
