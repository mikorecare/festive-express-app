import { supabase } from "@/lib/supabase";
import { useCallback, useRef, useState } from "react";

export type ConfirmOrderResult =
    | {
        success: true;
        order: {
            customer_confirmed: boolean;
            confirmed_at: string | null;
            status: string;
            preferred_install_dates: string[];
            confirmed_install_date: string | null;
        };
    }
    | {
        success: false;
        error: string;
        already_confirmed?: boolean;
        order?: {
            customer_confirmed: boolean;
            confirmed_at: string | null;
            status: string;
            preferred_install_dates: string[];
            confirmed_install_date: string | null;
        };
    };

type State = {
    data: ConfirmOrderResult | null;
    pending: boolean;
    error: string | null;
};

export function useConfirmOrderInstallDate() {
    const [state, setState] = useState<State>({
        data: null,
        pending: false,
        error: null,
    });

    const mounted = useRef(true);

    const confirm = useCallback(
        async (orderNumber: string, email: string): Promise<ConfirmOrderResult> => {
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
                const { data, error } = await supabase.rpc(
                    "confirm_order_install_date",
                    { p_order_number: orderNo, p_email: mail }
                );

                if (error) {
                    console.error("Confirm order RPC error:", error);
                    const err = "Could not confirm order";
                    if (mounted.current) setState({ data: null, pending: false, error: err });
                    return { success: false, error: err };
                }

                if (!data || data.success === false) {
                    const result: ConfirmOrderResult = {
                        success: false,
                        error: data?.error ?? "Could not confirm order",
                        already_confirmed: data?.already_confirmed,
                        order: data?.order,
                    };
                    if (mounted.current) {
                        setState({ data: result, pending: false, error: result.error });
                    }
                    return result;
                }

                const result: ConfirmOrderResult = {
                    success: true,
                    order: data.order,
                };
                if (mounted.current) {
                    setState({ data: result, pending: false, error: null });
                }
                return result;
            } catch (e: any) {
                console.error("Confirm order error:", e);
                const err = e?.message ?? "Could not confirm order";
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

    return { ...state, confirm, reset };
}