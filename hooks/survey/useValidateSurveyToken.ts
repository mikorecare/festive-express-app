import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

export type SurveyReview = {
    id: string;
    order_number: string;
    customer_name: string;
    email: string;
};

export type ValidateSurveyResponse = {
    success: true;
    review: SurveyReview;
    expires_at: string;
};

export type ValidateSurveyError = {
    success: false;
    error: string;
};

type State = {
    data: ValidateSurveyResponse | null;
    pending: boolean;
    error: string | null;
};

export function useValidateSurveyToken(token: string | null) {
    const [state, setState] = useState<State>({
        data: null,
        pending: !!token,
        error: null,
    });

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const validate = useCallback(async () => {
        if (!token) {
            setState({ data: null, pending: false, error: "Survey token is required" });
            return;
        }

        setState((s) => ({ ...s, pending: true, error: null }));

        try {
            const { data, error } = await supabase.rpc("validate_survey_token", {
                p_token: token,
            });

            if (error) {
                console.error("Survey validation error:", error);
                if (mounted.current) {
                    setState({ data: null, pending: false, error: "Failed to validate survey" });
                }
                return;
            }

            if (!data || data.success === false) {
                const message = data?.error ?? "Invalid survey link. Please check your email.";
                if (mounted.current) {
                    setState({ data: null, pending: false, error: message });
                }
                return;
            }

            const response: ValidateSurveyResponse = {
                success: true,
                review: data.review as SurveyReview,
                expires_at: data.expires_at as string,
            };

            if (mounted.current) {
                setState({ data: response, pending: false, error: null });
            }
        } catch (e: any) {
            console.error("Survey validation error:", e);
            if (mounted.current) {
                setState({
                    data: null,
                    pending: false,
                    error: e?.message ?? "Failed to validate survey",
                });
            }
        }
    }, [token]);

    useEffect(() => {
        if (token) validate();
    }, [token, validate]);

    return {
        data: state.data,
        pending: state.pending,
        error: state.error,
        refetch: validate,
    };
}