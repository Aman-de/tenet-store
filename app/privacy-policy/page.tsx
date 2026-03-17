export default function PrivacyPolicyPage() {
    return (
        <main className="pt-32 pb-24 bg-[#FAFAFA] min-h-screen">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-16 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl text-black mb-6">Privacy Policy</h1>
                    <div className="w-12 h-0.5 bg-black mx-auto"></div>
                </header>
                
                <div className="space-y-12 text-black/80 font-sans leading-relaxed">
                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Information We Collect</h2>
                        <p className="mb-4">We collect information that you provide directly to us when you use our services. This includes:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Contact information, such as your name, email address, mailing address, and phone number.</li>
                            <li>Billing information, such as credit card details and billing address.</li>
                            <li>Account information, such as your username and password.</li>
                            <li>Transaction information, such as details about the products you purchase.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, including to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Process your transactions and fulfill your orders.</li>
                            <li>Send you technical notices, updates, security alerts, and support messages.</li>
                            <li>Respond to your comments, questions, and customer service requests.</li>
                            <li>Communicate with you about products, services, offers, promotions, and events.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Information Sharing</h2>
                        <p>We do not share your personal information with third parties except as described in this Privacy Policy or with your consent. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal information. If you wish to exercise any of these rights, please contact us using the information provided on our Support page.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
