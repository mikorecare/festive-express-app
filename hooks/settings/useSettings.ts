import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface SiteSettings {
    contact_email?: string;
    contact_phone?: string;
    contact_phone_display?: string;
    contact_address?: string;
    fl_tax_rate?: string;
    social_facebook?: string;
    social_instagram?: string;
    social_x?: string;
    social_youtube?: string;
    social_pinterest?: string;
    copyright_text?: string;
    [key: string]: any;
}

const DEFAULT_SETTINGS: SiteSettings = {
    contact_email: "",
    contact_phone: "",
    contact_phone_display: "",
    contact_address: "",
    fl_tax_rate: "",
    social_facebook: "",
    social_instagram: "",
    social_x: "",
    social_youtube: "",
    social_pinterest: "",
    copyright_text: "",
};

type ApiResponse = { success: boolean; data: SiteSettings | null };

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [pending, setPending] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const fetchSettings = useCallback(async () => {
        setPending(true);
        setError(null);

        const { data, error } = await supabase.from("settings").select("*");

        if (!mounted.current) return;

        if (error) {
            console.error("Settings fetch error:", error);
            setError("Failed to load settings");
            setPending(false);
            return;
        }

        const settingsData: SiteSettings = {};
        if (Array.isArray(data)) {
            data.forEach((row: any) => {
                if (row.key && row.value !== undefined) {
                    settingsData[row.key] = row.value;
                }
            });
        }

        setSettings({ ...DEFAULT_SETTINGS, ...settingsData });
        setPending(false);
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const telHref = useMemo(() => {
        const raw =
            settings.contact_phone || settings.contact_phone_display || "";
        const digits = String(raw).replace(/[^\d+]/g, "");
        return digits ? `tel:${digits}` : "tel:+19412394722";
    }, [settings.contact_phone, settings.contact_phone_display]);

    return {
        settings,
        loadSettings: fetchSettings,
        telHref,
        pending,
        error,
    };
}