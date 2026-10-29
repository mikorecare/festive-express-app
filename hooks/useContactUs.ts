import { supabase } from "@/lib/supabase";
import { useCallback, useRef, useState } from "react";

export type ContactFormInput = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
};

export type ContactFormResult =
    | { success: true; message: string }
    | { success: false; error: string };

type State = {
    data: { message: string } | null;
    pending: boolean;
    error: string | null;
};

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function useContactForm() {
    const [state, setState] = useState<State>({
        data: null,
        pending: false,
        error: null,
    });

    const mounted = useRef(true);

    const submit = useCallback(
        async (input: ContactFormInput): Promise<ContactFormResult> => {
            mounted.current = true;
            setState({ data: null, pending: true, error: null });

            const firstName = String(input.firstName || "").trim();
            const lastName = String(input.lastName || "").trim();
            const email = String(input.email || "").trim();
            const phone = String(input.phone || "").trim();
            const message = String(input.message || "").trim();

            if (!firstName) {
                return fail(setState, mounted, "First name is required");
            }
            if (!lastName) {
                return fail(setState, mounted, "Last name is required");
            }
            if (!email || !EMAIL_RE.test(email)) {
                return fail(setState, mounted, "Valid email is required");
            }
            if (!phone) {
                return fail(setState, mounted, "Phone number is required");
            }
            if (!message) {
                return fail(setState, mounted, "Message is required");
            }

            try {
                const { data, error } = await supabase.rpc("handle_contact_form", {
                    p_first_name: firstName,
                    p_last_name: lastName,
                    p_email: email,
                    p_phone: phone,
                    p_message: message,
                });

                if (error) {
                    console.error("Contact form RPC error:", error);
                    return fail(setState, mounted, "Failed to send message. Please try again.");
                }

                // RPC can return { success, message } or { success: false, error }
                if (!data || data.success === false) {
                    const err = data?.error ?? "Failed to send message. Please try again.";
                    return fail(setState, mounted, err);
                }

                const successMessage =
                    data.message ?? "Thank you! Your message has been sent.";

                if (mounted.current) {
                    setState({ data: { message: successMessage }, pending: false, error: null });
                }
                return { success: true, message: successMessage };
            } catch (e: any) {
                console.error("Contact form error:", e);
                return fail(setState, mounted, e?.message ?? "Failed to send message. Please try again.");
            }
        },
        []
    );

    const reset = useCallback(() => {
        mounted.current = false;
        setState({ data: null, pending: false, error: null });
    }, []);

    return { ...state, submit, reset };
}

function fail(
    setState: React.Dispatch<React.SetStateAction<State>>,
    mounted: React.MutableRefObject<boolean>,
    error: string
): ContactFormResult {
    if (mounted.current) {
        setState({ data: null, pending: false, error });
    }
    return { success: false, error };
}