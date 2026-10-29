import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type OrderTimelineRow = {
    id: number | string;
    order_id: number | string;
    status: string;
    notes: string | null;
    created_at: string;
    [key: string]: any;
};

export type PromoCode = {
    id: number | string;
    code: string;
    description?: string | null;
    discount_type?: string | null;
    discount_value?: number | null;
    applies_to?: string | null;
    min_order_amount?: number | null;
    max_discount_amount?: number | null;
    usage_limit?: number | null;
    used_count?: number | null;
    starts_at?: string | null;
    expires_at?: string | null;
    is_active?: boolean | null;
};

export type OrderDetails = {
    id: number | string;
    order_number: string;
    billing_first_name: string | null;
    billing_last_name: string | null;
    billing_email: string | null;
    billing_phone: string | null;
    billing_address: string | null;
    billing_postcode: string | null;
    shipping_address: string | null;
    shipping_postcode: string | null;
    preferred_install_dates: string[];
    removal_dates: string[];
    preferred_install_date: string | null;
    removal_date: string | null;
    customer_note: string | null;
    subtotal: number | null;
    tax_total: number | null;
    total: number | null;
    deposit_amount: number | null;
    items: any[];
    promo_codes: PromoCode | null;
    discount_amount: number;
    payment_method: string | null;
    payment_status: string | null;
    status: string | null;
    install_status: string | null;
    metadata: any;
    created_at: string;
    updated_at: string;
    timeline: OrderTimelineRow[];
};

export type OrderResponse =
    | { success: true; data: OrderDetails }
    | { success: false; error: string };

type State = {
    data: OrderResponse | null;
    pending: boolean;
    error: string | null;
};

export function useOrderByNumber(
    orderNumber: string | null,
    email: string | null
) {
    const [state, setState] = useState<State>({
        data: null,
        pending: !!orderNumber && !!email,
        error: null,
    });

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const fetchOrder = useCallback(async () => {
        if (!orderNumber) {
            setState({
                data: { success: false, error: "Order number is required" },
                pending: false,
                error: "Order number is required",
            });
            return;
        }
        if (!email) {
            setState({
                data: { success: false, error: "Email is required" },
                pending: false,
                error: "Email is required",
            });
            return;
        }

        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase.rpc("get_order_by_number", {
                p_order_number: orderNumber,
                p_email: email,
            });

            if (error) {
                console.error("Order RPC error:", error);
                if (mounted.current) {
                    setState({
                        data: { success: false, error: "Failed to fetch order" },
                        pending: false,
                        error: "Failed to fetch order",
                    });
                }
                return;
            }

            // RPC returns jsonb: { success, error?, ...orderFields }
            if (!data || data.success === false) {
                const message = data?.error ?? "Order not found";
                if (mounted.current) {
                    setState({
                        data: { success: false, error: message },
                        pending: false,
                        error: message,
                    });
                }
                return;
            }

            const raw = data as any;
            const timeline: OrderTimelineRow[] = Array.isArray(raw.timeline)
                ? raw.timeline
                : [];

            const details: OrderDetails = {
                id: raw.id,
                order_number: raw.order_number,
                billing_first_name: raw.billing_first_name,
                billing_last_name: raw.billing_last_name,
                billing_email: raw.billing_email,
                billing_phone: raw.billing_phone,
                billing_address: raw.billing_address,
                billing_postcode: raw.billing_postcode,
                shipping_address: raw.shipping_address,
                shipping_postcode: raw.shipping_postcode,
                preferred_install_dates: raw.preferred_install_dates || [],
                removal_dates: raw.removal_dates || [],
                preferred_install_date: raw.preferred_install_dates?.[0] || null,
                removal_date: raw.removal_dates?.[0] || null,
                customer_note: raw.customer_note,
                subtotal: raw.subtotal,
                tax_total: raw.tax_total,
                total: raw.total,
                deposit_amount: raw.deposit_amount,
                items: raw.items || [],
                promo_codes: raw.promo_codes || null,
                discount_amount: raw.discount_amount || 0,
                payment_method: raw.payment_method,
                payment_status: raw.payment_status,
                status: raw.status,
                install_status: raw.install_status,
                metadata: raw.metadata,
                created_at: raw.created_at,
                updated_at: raw.updated_at,
                timeline,
            };

            if (mounted.current) {
                setState({
                    data: { success: true, data: details },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("Order fetch error:", e);
            if (mounted.current) {
                setState({
                    data: { success: false, error: e?.message ?? "Failed to fetch order" },
                    pending: false,
                    error: e?.message ?? "Failed to fetch order",
                });
            }
        }
    }, [orderNumber, email]);

    useEffect(() => {
        if (orderNumber && email) fetchOrder();
    }, [fetchOrder, orderNumber, email]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchOrder,
    };
}