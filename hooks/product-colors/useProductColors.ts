import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type ProductColor = {
    id: string;
    color_key: string;
    color_label: string;
    hex: string;
    swatch_css?: string | null;
    sort_order: number;
};

type State = {
    colors: ProductColor[];
    loaded: boolean;
    isLoading: boolean;
    error: string | null;
};

export function useProductColors() {
    const [state, setState] = useState<State>({
        colors: [],
        loaded: false,
        isLoading: false,
        error: null,
    });

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const loadColors = useCallback(async (force = false): Promise<ProductColor[]> => {
        if (!force && state.loaded && state.colors.length > 0) {
            return state.colors;
        }

        setState((s) => ({ ...s, isLoading: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("product_colors")
                .select("id, color_key, color_label, hex, swatch_css, sort_order")
                .eq("is_active", true)
                .order("sort_order", { ascending: true });

            console.log("[useProductColors] SUPABASE:", { data, error });

            if (error) {
                console.error("loadColors", error);
                if (mounted.current) {
                    setState({ colors: [], loaded: false, isLoading: false, error: "Failed to load product colors" });
                }
                throw error;
            }

            const colors = (data ?? []) as ProductColor[];
            if (mounted.current) {
                setState({ colors, loaded: true, isLoading: false, error: null });
            }
            return colors;
        } catch (e: any) {
            if (mounted.current) {
                setState({ colors: [], loaded: false, isLoading: false, error: e?.message ?? "Failed" });
            }
            throw e;
        }
    }, [state.loaded, state.colors]);

    useEffect(() => {
        loadColors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        colors: state.colors,
        loaded: state.loaded,
        isLoading: state.isLoading,
        error: state.error,
        loadColors,
        byKey: (key?: string | null) => {
            if (!key) return null;
            return state.colors.find((c) => c.color_key === key) || null;
        },
    };
}