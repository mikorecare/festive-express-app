import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type CookieContent = {
    id?: string;
    banner_image_url?: string | null;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type CookieResponse = {
    success: boolean;
    data: CookieContent | null;
};

type State = {
    data: CookieResponse | null;
    pending: boolean;
    error: string | null;
};

export function useCookiePolicy() {
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

    const fetchCookiePolicy = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("cookie_policy")
                .select("*")
                .eq("is_active", true)
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error("Cookie policy fetch error:", error);
                if (mounted.current) {
                    setState({
                        data: { success: false, data: null },
                        pending: false,
                        error: "Failed to load cookie policy",
                    });
                }
                return;
            }

            // Normalize banner_image_url to a full public URL
            if (
                data &&
                data.banner_image_url &&
                !data.banner_image_url.startsWith("http")
            ) {
                const cleanPath = data.banner_image_url.replace(/^\/+/, "");
                const { data: urlData } = supabase.storage
                    .from("Products")
                    .getPublicUrl(cleanPath);
                data.banner_image_url = urlData?.publicUrl || data.banner_image_url;
            }

            if (mounted.current) {
                setState({
                    data: { success: true, data: (data as CookieContent) ?? null },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("Cookie policy API error:", e);
            if (mounted.current) {
                setState({
                    data: { success: false, data: null },
                    pending: false,
                    error: e?.message ?? "Failed to load cookie policy",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchCookiePolicy();
    }, [fetchCookiePolicy]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchCookiePolicy,
    };
}