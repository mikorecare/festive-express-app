import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

const BUCKET = "Products";

export type SkuRow = {
    id: string | number;
    name: string;
    price?: number | string | null;
    sale_price?: number | string | null;
    stock?: number | null;
    image_url?: string | null;
    package_id: string | number;
    color_key?: string | null;
    color_label?: string | null;
};

export type PackageSkusResponse = {
    success: boolean;
    data: SkuRow[];
};

type State = {
    data: PackageSkusResponse | null;
    pending: boolean;
    error: string | null;
};

const toPublicUrl = (value: string | null | undefined): string | null => {
    if (!value) return value ?? null;
    if (/^https?:\/\//.test(value)) return value;
    const cleanPath = value.replace(/^\/+/, "");
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(cleanPath);
    return data?.publicUrl || value;
};

export function usePackageSkus() {
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

    const fetchSkus = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("products")
                .select(
                    "id, name, price, sale_price, stock, image_url, package_id, color_key, color_label"
                )
                .eq("is_package", true)
                .eq("is_active", true);

            if (error) {
                console.error("SKUs fetch error:", error);
                if (mounted.current) {
                    setState({
                        data: { success: false, data: [] },
                        pending: false,
                        error: "Failed to load SKUs",
                    });
                }
                return;
            }

            const transformed: SkuRow[] = (data || []).map((sku: any) => ({
                ...sku,
                image_url: toPublicUrl(sku.image_url),
            }));

            if (mounted.current) {
                setState({
                    data: { success: true, data: transformed },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("SKUs API error:", e);
            if (mounted.current) {
                setState({
                    data: { success: false, data: [] },
                    pending: false,
                    error: e?.message ?? "Failed to load SKUs",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchSkus();
    }, [fetchSkus]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchSkus,
    };
}