import { supabase } from "@/lib/supabase";
import { useCallback, useRef, useState } from "react";

export type SubmitSurveyInput = {
    token: string;
    rating_overall: number;
    rating_installation?: number | null;
    rating_technicians?: number | null;
    comments_installation?: string | null;
    comments_technicians?: string | null;
    comments_additional?: string | null;
    would_recommend?: boolean | null;
};

export type SubmitSurveyResult =
    | { success: true; message: string }
    | { success: false; error: string };

type State = {
    data: { message: string } | null;
    pending: boolean;
    error: string | null;
};

export function useSubmitSurvey() {
    const [state, setState] = useState<State>({
        data: null,
        pending: false,
        error: null,
    });

    const mounted = useRef(true);

    const submit = useCallback(
        async (input: SubmitSurveyInput): Promise<SubmitSurveyResult> => {
            mounted.current = true;
            setState({ data: null, pending: true, error: null });

            // client-side validation mirroring the endpoint
            if (!input.token) {
                const err = "Survey token is required";
                if (mounted.current) setState({ data: null, pending: false, error: err });
                return { success: false, error: err };
            }

            const rating = Number(input.rating_overall);
            if (!rating || rating < 1 || rating > 5) {
                const err = "Please provide a valid overall rating (1-5)";
                if (mounted.current) setState({ data: null, pending: false, error: err });
                return { success: false, error: err };
            }

            try {
                const { data, error } = await supabase.rpc("submit_survey", {
                    p_token: input.token,
                    p_rating_overall: rating,
                    p_rating_installation: input.rating_installation ?? null,
                    p_rating_technicians: input.rating_technicians ?? null,
                    p_comments_installation: input.comments_installation ?? null,
                    p_comments_technicians: input.comments_technicians ?? null,
                    p_comments_additional: input.comments_additional ?? null,
                    p_would_recommend: input.would_recommend ?? null,
                });

                if (error) {
                    console.error("Survey submission error:", error);
                    const err = "Failed to submit survey";
                    if (mounted.current) setState({ data: null, pending: false, error: err });
                    return { success: false, error: err };
                }

                // RPC returns { success, message } or { success: false, error }
                if (!data || data.success === false) {
                    const err = data?.error ?? "Failed to submit survey";
                    if (mounted.current) setState({ data: null, pending: false, error: err });
                    return { success: false, error: err };
                }

                const message = data.message ?? "Thank you for your feedback!";
                if (mounted.current) {
                    setState({ data: { message }, pending: false, error: null });
                }
                return { success: true, message };
            } catch (e: any) {
                console.error("Survey submission error:", e);
                const err = e?.message ?? "Failed to submit survey";
                if (mounted.current) setState({ data: null, pending: false, error: err });
                return { success: false, error: err };
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