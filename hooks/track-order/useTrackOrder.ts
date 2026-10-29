import { supabase } from "@/lib/supabase";
import { useCallback, useRef, useState } from "react";

const BUCKET = "Products";

export type TrackOrderItem = {
    product_id?: string | number;
    id?: string | number;
    name?: string;
    quantity?: number;
    price?: number;
    image_url?: string | null;
    [key: string]: any;
};

export type TrackOrderTimeline = {
    id: string;
    status: string;
    notes: string | null;
    created_at: string;
};

export type TrackOrder = {
    id: string;
    order_number: string | null;
    status: string | null;
    payment_status: string | null;
    install_status: string | null;
    created_at: string | null;
    total: number | null;
    preferred_install_dates: string[];
    preferred_install_date: string | null;
    confirmed_install_date: string | null;
    items: TrackOrderItem[];
    timeline: TrackOrderTimeline[];
    customer_confirmed: boolean;
    confirmed_at: string | null;
};

export type TrackOrderResult =
    | { success: true; order: TrackOrder }
    | { success: false; error: string };

type State = {
    data: TrackOrder | null;
    pending: boolean;
    error: string | null;
};

const toPublicUrl = (value: string | null | undefined): string | null => {
    if (!value) return null;
    if (/^https?:\/\//.test(value)) return value;
    const cleanPath = value.replace(/^\/+/, "");
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(cleanPath);
    return data?.publicUrl || value;
};

export function useTrackOrder() {
    const [state, setState] = useState<State>({
        data: null,
        pending: false,
        error: null,
    });

    const mounted = useRef(true);

    const track = useCallback(
        async (orderNumber: string, email: string): Promise<TrackOrderResult> => {
            mounted.current = true;
            setState({ data: null, pending: true, error: null });

            const orderNo = String(orderNumber || "").trim();
            const mail = String(email || "").trim().toLowerCase();

            if (!orderNo || !mail) {
                const err = "Order number and email are required";
                if (mounted.current) setState({ data: null, pending: false, error: err });
                return { success: false, error: err };
            }

            try {
                const { data, error } = await supabase.rpc("track_order", {
                    p_order_number: orderNo,
                    p_email: mail,
                });

                if (error) {
                    console.error("Track order RPC error:", error);
                    const err = "Failed to look up order";
                    if (mounted.current) setState({ data: null, pending: false, error: err });
                    return { success: false, error: err };
                }

                if (!data || data.success === false) {
                    const err = data?.error ?? "No matching order found";
                    if (mounted.current) setState({ data: null, pending: false, error: err });
                    return { success: false, error: err };
                }

                const raw = data.order as any;
                const rawItems: TrackOrderItem[] = Array.isArray(raw.items) ? raw.items : [];
                const itemsWithImages: TrackOrderItem[] = rawItems.map((item) => ({
                    ...item,
                    image_url: toPublicUrl(item.image_url),
                }));

                const order: TrackOrder = {
                    id: raw.id,
                    order_number: raw.order_number,
                    status: raw.status,
                    payment_status: raw.payment_status,
                    install_status: raw.install_status,
                    created_at: raw.created_at,
                    total: raw.total,
                    preferred_install_dates: raw.preferred_install_dates || [],
                    preferred_install_date: raw.preferred_install_date || null,
                    confirmed_install_date: raw.confirmed_install_date || null,
                    items: itemsWithImages,
                    timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
                    customer_confirmed: Boolean(raw.customer_confirmed),
                    confirmed_at: raw.confirmed_at || null,
                };

                if (mounted.current) {
                    setState({ data: order, pending: false, error: null });
                }
                return { success: true, order };
            } catch (e: any) {
                console.error("Track order error:", e);
                const err = e?.message ?? "Failed to look up order";
                if (mounted.current) setState({ data: null, pending: false, error: err });
                return { success: false, error: err };
            }
        },
        []
    );

    const reset = useCallback(() => {
        mounted.current = false;
        setState({ data: null, pending: false, error: null });
    }, []);

    return { ...state, track, reset };
}