export default function ShippingPage() {
    return (
        <main className="pt-32 pb-24 bg-[#FAFAFA] min-h-screen">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-16 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl text-black mb-6">Shipping Policy</h1>
                    <div className="w-12 h-0.5 bg-black mx-auto"></div>
                </header>
                
                <div className="space-y-12 text-black/80 font-sans leading-relaxed">
                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Domestic Processing & Shipping time</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>All orders are processed within 1-2 business days.</li>
                            <li>Standard shipping typically takes 3-5 business days.</li>
                            <li>Express shipping options are available at checkout.</li>
                            <li>Orders are not shipped or delivered on weekends or holidays.</li>
                            <li>If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Shipping rates & delivery estimates</h2>
                        <p className="mb-4">Shipping charges for your order will be calculated and displayed at checkout. We occasionally offer free shipping on orders over a certain threshold, which will be clearly indicated on our website.</p>
                        <div className="bg-white border border-neutral-200 p-6 rounded-lg">
                            <p className="font-medium">Please Note:</p>
                            <p className="text-sm mt-2">Delivery delays can occasionally occur due to unforeseen circumstances or carrier delays.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Shipment confirmation & Order tracking</h2>
                        <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl text-black mb-4">Damages</h2>
                        <p>Tenet Archives is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
