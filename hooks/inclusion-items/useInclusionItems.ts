import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type InclusionSpec = {
    id: string;
    name: string;
    slug: string;
    description: string;
    color_options: string[] | any;
    features: string[] | any;
    specifications: Record<string, string> | any;
    sort_order: number;
};

export type InclusionItemsResponse = {
    success: boolean;
    data: InclusionSpec[];
};

type State = {
    data: InclusionItemsResponse | null;
    pending: boolean;
    error: string | null;
};

export function useInclusionItems() {
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

    const fetchInclusionItems = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("inclusion_items")
                .select(
                    "id, name, slug, description, color_options, features, specifications, sort_order"
                )
                .order("sort_order", { ascending: true });

            if (error) {
                console.error("Inclusion items fetch error:", error);
                if (mounted.current) {
                    setState({
                        data: { success: false, data: [] },
                        pending: false,
                        error: "Failed to load inclusion items",
                    });
                }
                return;
            }

            if (mounted.current) {
                setState({
                    data: { success: true, data: (data as InclusionSpec[]) || [] },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("Inclusion items API error:", e);
            if (mounted.current) {
                setState({
                    data: { success: false, data: [] },
                    pending: false,
                    error: e?.message ?? "Failed to load inclusion items",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchInclusionItems();
    }, [fetchInclusionItems]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchInclusionItems,
    };
}