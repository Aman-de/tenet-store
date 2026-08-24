import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/man(.*)',
    '/men(.*)',
    '/woman(.*)',
    '/women(.*)',
    '/gadget(.*)',
    '/gadgets(.*)',
    '/all(.*)',
    '/collection(.*)',
    '/product(.*)',
    '/circle(.*)',
    '/orders(.*)',
    '/editorial(.*)',
    '/studio(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api(.*)',
    '/trpc(.*)',
    '/ingest(.*)',
    '/search(.*)',
    '/about(.*)',
    '/support(.*)',
    '/sustainability(.*)',
    '/careers(.*)',
    '/shipping(.*)',
    '/returns(.*)',
    '/privacy-policy(.*)',
    '/terms-and-conditions(.*)',
    '/refund-and-cancellation(.*)',
    '/sitemap.xml',
    '/robots.txt',
    '/manifest.json',
    '/sw.js',
    '/sw.js.map',
    '/icon-(.*)',
    '/images(.*)',
    '/favicon.ico',
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals, PostHog ingest, and all static files, unless found in search params
        '/((?!_next|ingest|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
