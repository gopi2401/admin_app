// Import the APIRoute type

import type { APIRoute } from "astro";

// Define a route and use the get function as the handler
const myGetRoute: APIRoute = async ({ request, cookies, redirect }) => {
    const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
    if (!idToken) {
        return new Response("No token found", { status: 401 });
    }

    return redirect("/");
};

// Register the route with your routing system or framework
// This part may vary depending on what you're using (e.g., Express, Oak, etc.)
// The idea is to associate this route handler with a specific URL path and HTTP method (GET)
