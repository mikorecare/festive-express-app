import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type AboutUsContent = {
    id?: string;
    banner_image_url?: string | null;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    description_image_url?: string | null;
};

export type ApiResponse = {
    success: boolean;
    data: AboutUsContent | null;
};

type State = {
    data: ApiResponse | null;
    pending: boolean;
    error: string | null;
};

export function useAboutUs() {
    const [state, setState] = useState<State>({
        data: null,
        pending: true,
        error: null,
    });

    // prevent setState after unmount
    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const fetchAboutUs = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        const { data, error } = await supabase
            .from("about_us")
            .select(
                "id, banner_image_url, title, subtitle, description, description_image_url"
            )
            .limit(1)
            .maybeSingle();

        if (!mounted.current) return;

        if (error) {
            setState({
                data: { success: false, data: null },
                pending: false,
                error: error.message,
            });
            return;
        }

        setState({
            data: { success: true, data: (data as AboutUsContent) ?? null },
            pending: false,
            error: null,
        });
    }, []);

    useEffect(() => {
        fetchAboutUs();
    }, [fetchAboutUs]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchAboutUs,
    };
}