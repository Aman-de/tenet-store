import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json({ error: "Missing lat or lon" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
            headers: {
                "User-Agent": "TenetStore/1.0 (Contact: admin@tenetarchives.com)",
                "Accept-Language": "en-US,en;q=0.9"
            }
        });

        if (!res.ok) {
            throw new Error(`Nominatim API responded with status: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Geocoding Error:", error);
        return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
    }
}
