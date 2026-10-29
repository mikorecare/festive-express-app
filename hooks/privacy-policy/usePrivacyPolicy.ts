import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type PrivacyContent = {
    id?: string;
    banner_image_url?: string | null;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type PrivacyResponse = {
    success: boolean;
    data: PrivacyContent | null;
};

type State = {
    data: PrivacyResponse | null;
    pending: boolean;
    error: string | null;
};

export function usePrivacyPolicy() {
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

    const fetchPrivacy = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase
                .from("privacy_policy")
                .select("*")
                .eq("is_active", true)
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error("Privacy policy fetch error:", error);
                if (mounted.current) {
                    setState({
                        data: { success: false, data: null },
                        pending: false,
                        error: "Failed to load privacy policy",
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
                    data: { success: true, data: (data as PrivacyContent) ?? null },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("Privacy policy API error:", e);
            if (mounted.current) {
                setState({
                    data: { success: false, data: null },
                    pending: false,
                    error: e?.message ?? "Failed to load privacy policy",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchPrivacy();
    }, [fetchPrivacy]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchPrivacy,
    };
}