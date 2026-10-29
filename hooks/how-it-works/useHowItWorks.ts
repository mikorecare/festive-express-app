import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type Step = {
    title: string;
    description: string;
};

export type HowItWorksContent = {
    id?: string;
    banner_image_url?: string | null;
    title?: string | null;
    subtitle?: string | null;
    steps?: Step[] | null;
    footer_description?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type HowItWorksResponse = {
    success: boolean;
    data: HowItWorksContent | null;
};

type State = {
    data: HowItWorksResponse | null;
    pending: boolean;
    error: string | null;
};

export function useHowItWorks() {
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

    const fetchHowItWorks = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("how_it_works")
                .select("*")
                .eq("is_active", true)
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error("How it works fetch error:", error);
                if (mounted.current) {
                    setState({
                        data: { success: false, data: null },
                        pending: false,
                        error: "Failed to load how it works content",
                    });
                }
                return;
            }

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
                    data: { success: true, data: (data as HowItWorksContent) ?? null },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("How it works API error:", e);
            if (mounted.current) {
                setState({
                    data: { success: false, data: null },
                    pending: false,
                    error: e?.message ?? "Failed to load how it works content",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchHowItWorks();
    }, [fetchHowItWorks]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchHowItWorks,
    };
}