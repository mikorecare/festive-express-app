import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type TermsContent = {
    id?: string;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type TermsResponse = {
    success: boolean;
    data: TermsContent | null;
};

type State = {
    data: TermsResponse | null;
    pending: boolean;
    error: string | null;
};

export function useTermsOfUse() {
    const [state, setState] = useState<State>({
        data: null,
        pending: true,
        error: null,
    });

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const fetchTerms = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("terms_of_use")
                .select("*")
                .eq("is_active", true)
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error("Terms of use fetch error:", error);
                if (mounted.current) {
                    setState({
                        data: { success: false, data: null },
                        pending: false,
                        error: "Failed to load terms of use",
                    });
                }
                return;
            }

            if (mounted.current) {
                setState({
                    data: { success: true, data: (data as TermsContent) ?? null },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("Terms of use API error:", e);
            if (mounted.current) {
                setState({
                    data: { success: false, data: null },
                    pending: false,
                    error: e?.message ?? "Failed to load terms of use",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchTerms();
    }, [fetchTerms]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchTerms,
    };
}