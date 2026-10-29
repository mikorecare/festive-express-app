import {
    createOrder,
    type CreateOrderInput,
    type CreateOrderResult,
    type CreatedOrder,
} from "@/lib/orders";
import { useCallback, useRef, useState } from "react";

type State = {
    data: CreatedOrder | null;
    pending: boolean;
    error: string | null;
    existingOrder: string | null;
};

export function useCreateOrder() {
    const [state, setState] = useState<State>({
        data: null,
        pending: false,
        error: null,
        existingOrder: null,
    });

    const mounted = useRef(true);

    const submit = useCallback(
        async (input: CreateOrderInput): Promise<CreateOrderResult> => {
            mounted.current = true;
            setState({ data: null, pending: true, error: null, existingOrder: null });

            try {
                const result = await createOrder(input);

                if (!mounted.current) return result;

                if (result.success) {
                    setState({
                        data: result.order,
                        pending: false,
                        error: null,
                        existingOrder: null,
                    });
                } else {
                    setState({
                        data: null,
                        pending: false,
                        error: result.error,
                        existingOrder: result.existing_order ?? null,
                    });
                }

                return result;
            } catch (e: any) {
                const message = e?.message ?? "Failed to create order";
                if (mounted.current) {
                    setState({
                        data: null,
                        pending: false,
                        error: message,
                        existingOrder: null,
                    });
                }
                return { success: false, error: message };
            }
        },
        []
    );

    const reset = useCallback(() => {
        mounted.current = false;
        setState({ data: null, pending: false, error: null, existingOrder: null });
    }, []);

    return { ...state, submit, reset };
}