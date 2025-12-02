import { events } from "./eventsData";

export async function GET() {
    return new Response(JSON.stringify(events), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}