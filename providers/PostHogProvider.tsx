'use client';

import posthog from 'posthog-js';
import { useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname, useSearchParams } from 'next/navigation';

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (posthog.__loaded && pathname) {
            let url = window.origin + pathname;
            if (searchParams && searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }
            posthog.capture('$pageview', {
                $current_url: url,
            });

            const handleBeforeUnload = () => {
                posthog.capture('$pageleave', {
                    $current_url: url,
                });
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                posthog.capture('$pageleave', {
                    $current_url: url,
                });
            };
        }
    }, [pathname, searchParams]);

    return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

        if (posthogKey && typeof window !== 'undefined') {
            if (!posthog.__loaded) {
                posthog.init(posthogKey, {
                    api_host: "/ingest",
                    ui_host: posthogHost, // keep for identifying where to send user to the dashboard
                    person_profiles: 'always',
                    capture_pageview: false // We capture manually below
                });
            }
        }
    }, []);

    useEffect(() => {
        if (!posthog.__loaded) return;

        if (isLoaded && user) {
            posthog.identify(user.id, {
                email: user.primaryEmailAddress?.emailAddress,
                name: user.fullName,
            });
        } else if (isLoaded && !user) {
            posthog.reset();
        }
    }, [user, isLoaded]);

    return (
        <>
            <Suspense fallback={null}>
                <PostHogPageView />
            </Suspense>
            {children}
        </>
    );
}
