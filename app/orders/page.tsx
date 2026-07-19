 
import { client } from "@/lib/sanity";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Truck, CheckCircle, Clock, ChevronLeft, XCircle } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

// Helper for Status Badge
const StatusBadge = ({ status }: { status: string }) => {
    switch (status.toLowerCase()) {
        case 'cancelled':
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-red-100">
                    <XCircle className="w-3 h-3" />
                    Cancelled
                </span>
            );
        case 'delivered':
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-100">
                    <CheckCircle className="w-3 h-3" />
                    Delivered
                </span>
            );
        case 'processing':
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-yellow-100">
                    <Clock className="w-3 h-3" />
                    Processing
                </span>
            );
        case 'shipped':
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-100">
                    <Truck className="w-3 h-3" />
                    Shipped
                </span>
            );
        default:
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-[#141414] text-neutral-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-neutral-200 dark:border-neutral-800">
                    <Clock className="w-3 h-3" />
                    Pending
                </span>
            );
    }
};

const OrderStepper = ({ status }: { status: string }) => {
    if (status.toLowerCase() === 'cancelled') return null;

    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = steps.indexOf(status.toLowerCase());

    return (
        <div className="flex items-center w-full max-w-sm">
            {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isLast = index === steps.length - 1;

                return (
                    <div key={step} className={`flex items-center ${isLast ? 'w-auto' : 'flex-1'}`}>
                        <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-black' : 'bg-neutral-200 dark:bg-neutral-800'} transition-colors duration-300`} />
                        {!isLast && (
                            <div className={`h-0.5 w-full mx-1 ${index < currentStepIndex ? 'bg-black' : 'bg-neutral-200 dark:bg-neutral-800'} transition-colors duration-300`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

import GuestOrderForm from "./GuestOrderForm";

export default async function OrdersPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;
    const user = await currentUser();

    let email = user?.emailAddresses[0]?.emailAddress;

    if (!email && searchParams.email && typeof searchParams.email === "string") {
        email = searchParams.email;
    }

    if (!email) {
        return <GuestOrderForm />;
    }

    const query = `*[_type == "order" && lower(email) == lower($email)] | order(createdAt desc) {
    _id,
    orderNumber,
    status,
    createdAt,
    totalPrice,
    products[]{
      quantity,
      size,
      color,
      piece,
      product->{
        title,
        "slug": slug.current,
        "imageUrl": variants[0].images[0].asset->url
      }
    }
  }`;

    const orders = await client.fetch(query, { email });

    return (
        <div className="min-h-screen pt-32 lg:pt-24 pb-32 lg:pb-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors w-fit group">
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Shop
                        </Link>
                        <div>
                            <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-2">My Orders</h1>
                            <p className="font-sans text-neutral-500 text-sm">Track your past purchases and returns.</p>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 rounded-xl shadow-sm text-center">
                        <div className="w-16 h-16 bg-neutral-50 dark:bg-[#0A0A0A] rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-8 h-8 text-neutral-300" />
                        </div>
                        <h2 className="font-serif text-xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-2">No active orders</h2>
                        <p className="text-neutral-500 text-sm mb-6 max-w-xs mx-auto">It looks like you haven&apos;t placed any orders yet.</p>
                        <Link href="/" className="px-8 py-3 bg-[#1A1A1A] text-white font-sans text-xs uppercase tracking-widest hover:bg-black transition-colors rounded-full">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">

                        {orders.map((order: any) => {
                            // Calculate expected delivery (10 days from creation)
                            const created = new Date(order.createdAt);
                            const expected = new Date(created);
                            expected.setDate(created.getDate() + 10);

                            let displayStatus = order.status || 'pending';

                            return (
                                <div key={order._id} className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {/* Order Header */}
                                    <div className="bg-neutral-50 dark:bg-[#0A0A0A] border-b border-neutral-100 dark:border-neutral-800 p-4 md:p-6 flex flex-wrap items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Order Placed</p>
                                            <p className="font-sans text-sm text-[#1A1A1A] dark:text-[#F4F1ED]">{created.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Total</p>
                                            <p className="font-sans text-sm text-[#1A1A1A] dark:text-[#F4F1ED]">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Order #</p>
                                            <p className="font-sans text-sm text-[#1A1A1A] dark:text-[#F4F1ED]">{order.orderNumber}</p>
                                        </div>
                                        <div className="ml-auto flex flex-col items-end gap-2">
                                            <StatusBadge status={displayStatus} />
                                            {displayStatus === 'delivered' ? (
                                                <p className="text-[10px] text-green-600 font-medium">
                                                    Delivered on: <span className="text-[#1A1A1A] dark:text-[#F4F1ED]">{expected.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                </p>
                                            ) : (
                                                <p className="text-[10px] text-neutral-400 font-medium">
                                                    Est. Delivery: <span className="text-[#1A1A1A] dark:text-[#F4F1ED]">{expected.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                </p>
                                            )}
                                            <div className="mt-1">
                                                <OrderStepper status={displayStatus} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-4 md:p-6 space-y-4">
                                        { }
                                        {order.products?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-4 items-start">
                                                <div className="relative w-16 h-20 bg-neutral-100 dark:bg-[#141414] rounded-sm overflow-hidden shrink-0 border border-neutral-100 dark:border-neutral-800">
                                                    {item.product?.imageUrl ? (
                                                        <Image
                                                            src={item.product.imageUrl}
                                                            alt={item.product.title || "Product"}
                                                            fill
                                                            sizes="64px"
                                                            loading="lazy"
                                                            quality={60}
                                                            unoptimized={item.product.imageUrl.startsWith("http")}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-serif text-sm text-[#1A1A1A] dark:text-[#F4F1ED] truncate">{item.product?.title || "Unknown Product"}</h3>
                                                    <p className="text-xs text-neutral-500 mt-1">
                                                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`} {item.piece && item.piece !== 'set' && `• Piece: ${item.piece === 'top' ? 'Top' : 'Bottom'} only`}
                                                    </p>
                                                </div>
                                                <Link href={`/product/${item.product?.slug}`} className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED] underline decoration-1 underline-offset-4 hover:no-underline">
                                                    View
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
