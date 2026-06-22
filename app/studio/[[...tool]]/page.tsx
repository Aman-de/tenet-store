import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'
import StudioWrapper from './StudioWrapper'

export { metadata, viewport } from 'next-sanity/studio'

export default async function StudioPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect("/sign-in");
    }

    const adminEmails = ["tenetarchives@gmail.com", "admin@tenetarchives.com"];
    const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase() || "";
    const isAdminRole = user.publicMetadata?.role === "admin";

    if (!isAdminRole && !adminEmails.includes(userEmail)) {
        return (
            <div className="min-h-screen pt-28 pb-20 px-4 flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0A]">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
                <h1 className="font-serif text-3xl mb-4 text-[#1A1A1A] dark:text-[#F4F1ED]">Access Denied</h1>
                <p className="font-sans text-neutral-500 max-w-md text-center">
                    You do not have the required permissions to view this Sanity Studio. Please contact the administrator.
                </p>
            </div>
        );
    }

    return (
        <StudioWrapper>
            <NextStudio config={config} />
        </StudioWrapper>
    );
}
