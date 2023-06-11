import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import sharp from "sharp";

export const GET = (async ({ url }) => {
    const image = Buffer.from(url.searchParams.get("image"), "base64");
    if (image.length === 0) {
        return error(400, "No image provided");
    }
    const resized = await sharp(image).resize(512, 512, { fit: "contain", kernel: "nearest" }).png().toBuffer();
    return new Response(resized, {
        headers: {
            "Content-Type": "image/png"
        }
    });


}) satisfies RequestHandler;
