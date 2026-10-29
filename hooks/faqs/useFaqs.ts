import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type FaqItem = {
    id: number;
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
};

export type CategoryWithFaqs = {
    id: number;
    name: string;
    sort_order: number;
    faqs: FaqItem[];
};

export type FaqSettings = {
    contact_phone_display: string;
    contact_phone: string;
    contact_email: string;
};

export type FaqApiResponse = {
    success: boolean;
    categories: CategoryWithFaqs[];
    settings: FaqSettings;
};

type State = {
    data: FaqApiResponse | null;
    pending: boolean;
    error: string | null;
};

export function useFaqs() {
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

    const fetchFaqs = useCallback(async () => {
        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            // 1) Categories + nested faqs
            const { data: categoriesData, error: categoriesError } = await supabase
                .from("faq_categories")
                .select(
                    `
            id,
            name,
            sort_order,
            faqs (
              id,
              question,
              answer,
              sort_order,
              is_active
            )
          `
                )
                .eq("is_active", true)
                .order("sort_order");

            if (categoriesError) {
                console.error("FAQ categories fetch error:", categoriesError);
                if (mounted.current) {
                    setState({
                        data: null,
                        pending: false,
                        error: "Failed to load FAQ categories",
                    });
                }
                return;
            }

            // 2) Contact settings
            const { data: settingsData, error: settingsError } = await supabase
                .from("settings")
                .select("key, value")
                .in("key", ["contact_phone_display", "contact_phone", "contact_email"]);

            if (settingsError) {
                console.error("Settings fetch error:", settingsError);
                if (mounted.current) {
                    setState({
                        data: null,
                        pending: false,
                        error: "Failed to load settings",
                    });
                }
                return;
            }

            // 3) Normalize categories
            const categories: CategoryWithFaqs[] = (
                (categoriesData || []) as any[]
            ).map((cat) => ({
                id: cat.id,
                name: cat.name,
                sort_order: cat.sort_order,
                faqs: ((cat.faqs || []) as any[])
                    .filter((f) => f.is_active)
                    .sort((a, b) => a.sort_order - b.sort_order),
            }));

            // 4) Normalize settings
            const settingsMap: Record<string, string> = {};
            if (settingsData && Array.isArray(settingsData)) {
                settingsData.forEach((row: any) => {
                    const value =
                        typeof row.value === "string"
                            ? row.value.replace(/^"|"$/g, "")
                            : row.value;
                    settingsMap[row.key] = value || "";
                });
            }

            const settings: FaqSettings = {
                contact_phone_display: settingsMap.contact_phone_display || "",
                contact_phone: settingsMap.contact_phone || "",
                contact_email: settingsMap.contact_email || "",
            };

            if (settings.contact_phone) {
                settings.contact_phone = settings.contact_phone.replace(/[^\d+]/g, "");
            }

            if (mounted.current) {
                setState({
                    data: { success: true, categories, settings },
                    pending: false,
                    error: null,
                });
            }
        } catch (e: any) {
            console.error("FAQs API error:", e);
            if (mounted.current) {
                setState({
                    data: null,
                    pending: false,
                    error: e?.message ?? "Failed to load FAQs",
                });
            }
        }
    }, []);

    useEffect(() => {
        fetchFaqs();
    }, [fetchFaqs]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: fetchFaqs,
    };
}