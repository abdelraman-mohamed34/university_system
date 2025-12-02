import { universityData } from "../../../../data/uniData.js";

export async function GET() {
    return new Response(JSON.stringify(universityData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}