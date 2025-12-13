import connectDB from "../../lib/mongodb.js";
import Professor from "../../../models/Professor.js";

async function seed() {
    try {
        await connectDB();

        await Professor.deleteMany({});

        console.log("Seeding finished successfully");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();