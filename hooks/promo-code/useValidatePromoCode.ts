import { supabase } from "@/lib/supabase";
import { useCallback, useRef, useState } from "react";

export type PromoCode = {
    id: string;
    code: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
    min_order_amount: number | null;
    max_discount_amount: number | null;
    usage_limit: number | null;
    used_count: number;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
};

export type ValidatePromoResult =
    | { success: true; data: PromoCode }
    | { success: false; error: string };

type State = {
    data: PromoCode | null;
    pending: boolean;
    error: string | null;
};

export function useValidatePromoCode() {
    const [state, setState] = useState<State>({
        data: null,
        pending: false,
        error: null,
    });

    const mounted = useRef(true);

    const validate = useCallback(
        async (code: string, subtotal: number): Promise<ValidatePromoResult> => {
            mounted.current = true;
            setState({ data: null, pending: true, error: null });

            if (!code || !code.trim()) {
                const err = "Please enter a promo code";
                if (mounted.current) {
                    setState({ data: null, pending: false, error: err });
                }
                return { success: false, error: err };
            }

            try {
                const { data, error } = await supabase.rpc("validate_promo_code", {
                    p_code: code,
                    p_subtotal: subtotal,
                });

                if (error) {
                    console.error("Promo validation error:", error);
                    const err = "Failed to validate promo code";
                    if (mounted.current) {
                        setState({ data: null, pending: false, error: err });
                    }
                    return { success: false, error: err };
                }

                // RPC returns { success, error?, data? }
                if (!data || data.success === false) {
                    const err = data?.error ?? "Invalid promo code";
                    if (mounted.current) {
                        setState({ data: null, pending: false, error: err });
                    }
                    return { success: false, error: err };
                }

                const promo = data.data as PromoCode;
                if (mounted.current) {
                    setState({ data: promo, pending: false, error: null });
                }
                return { success: true, data: promo };
            } catch (e: any) {
                const err = e?.message ?? "Failed to validate promo code";
                if (mounted.current) {
                    setState({ data: null, pending: false, error: err });
                }
                return { success: false, error: err };
            }
        },
        []
    );

    const reset = useCallback(() => {
        mounted.current = false;
        setState({ data: null, pending: false, error: null });
    }, []);

    return { ...state, validate, reset };
}