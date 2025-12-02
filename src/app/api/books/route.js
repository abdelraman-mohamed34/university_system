import { mockBooks } from "../../../../data/books";

export async function GET() {
    return new Response(JSON.stringify(mockBooks), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}