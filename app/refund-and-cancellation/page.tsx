export default function RefundCancellationPage() {
    return (
        <main className="pt-32 pb-24 bg-[#FAFAFA] min-h-screen">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-16 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl text-black mb-6">Refund & Cancellation</h1>
                    <div className="w-12 h-0.5 bg-black mx-auto"></div>
                </header>
                
                <div className="space-y-12 text-black/80 font-sans leading-relaxed">
                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Returns Policy</h2>
                        <p className="mb-4">We accept returns within 14 days of the original delivery date. Items must be in their original, unused condition with all tags attached and in original packaging.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To initiate a return, please contact us via the Support page with your order number.</li>
                            <li>Customers are responsible for return shipping costs unless the item was defective or incorrect.</li>
                            <li>Sale items and custom-made products are final sale and non-returnable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Refund Process</h2>
                        <p>Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed automatically to your original method of payment within 5-7 business days. Please remember it can take some time for your bank or credit card company to process and post the refund.</p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Order Cancellations</h2>
                        <p className="mb-4">You may cancel your order within 24 hours of placement for a full refund. As we process orders quickly to ensure rapid delivery, we cannot guarantee cancellation after this window.</p>
                        <p>If your order has already shipped, you will need to follow the standard Returns process once you receive the package.</p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Exchanges</h2>
                        <p>We do not currently offer direct exchanges. The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
