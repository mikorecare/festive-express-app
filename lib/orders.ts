import { supabase } from "@/lib/supabase";

export type CreateOrderInput = {
    first_name: string;
    last_name: string;
    email: string;
    billing_phone?: string;
    billing_address?: string;
    billing_postcode?: string;
    shipping_address?: string;
    shipping_postcode?: string;
    preferred_install_dates?: string[];
    removal_dates?: string[];
    customer_note?: string | null;
    items?: any[];
    subtotal?: number;
    tax_total?: number;
    total?: number;
    deposit_amount?: number;
    transaction_id: string;
    approval_code?: string | null;
    payment_token?: string | null;
    promo_code_id?: string | null;
};

export type CreatedOrder = {
    id: string | number;
    order_number: string;
    total: number;
    status: string;
};

export type CreateOrderResult =
    | { success: true; order: CreatedOrder }
    | { success: false; error: string; existing_order?: string };

export async function createOrder(
    input: CreateOrderInput
): Promise<CreateOrderResult> {
    if (!input.transaction_id) {
        return { success: false, error: "Transaction ID required" };
    }

    // 1) Duplicate check
    const { data: existingOrder } = await supabase
        .from("orders")
        .select("id, order_number")
        .eq("transaction_id", input.transaction_id)
        .maybeSingle();

    if (existingOrder) {
        return {
            success: false,
            error: "Duplicate transaction",
            existing_order: existingOrder.order_number,
        };
    }

    // 2) Resolve current user (guest allowed)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 3) Insert order
    const { data: inserted, error: insertError } = await supabase
        .from("orders")
        .insert({
            user_id: user?.id ?? null,
            billing_first_name: input.first_name,
            billing_last_name: input.last_name,
            billing_email: input.email,
            billing_phone: input.billing_phone || "",
            billing_address: input.billing_address || input.shipping_address || "",
            billing_postcode: input.billing_postcode || input.shipping_postcode || "",
            shipping_address: input.shipping_address || input.billing_address || "",
            shipping_postcode: input.shipping_postcode || input.billing_postcode || "",
            preferred_install_dates: input.preferred_install_dates || [],
            removal_dates: input.removal_dates || [],
            customer_note: input.customer_note || null,
            items: input.items || [],
            subtotal: input.subtotal || 0,
            tax_total: input.tax_total || 0,
            total: input.total || 0,
            deposit_amount: input.deposit_amount || 0,
            payment_method: "converge",
            payment_status: "paid",
            transaction_id: input.transaction_id,
            approval_code: input.approval_code || null,
            payment_token: input.payment_token || null,
            status: "pending",
            install_status: "scheduled",
            promo_code_id: input.promo_code_id || null,
        })
        .select()
        .single();

    if (insertError || !inserted) {
        console.error("Order creation error:", insertError);
        return { success: false, error: "Failed to create order" };
    }

    const { error: timelineError } = await supabase.rpc("add_order_timeline", {
        p_order_id: inserted.id,
        p_notes: "Order created and payment confirmed",
        p_status: "pending",
    });

    if (timelineError) {
        console.warn("Order timeline insert failed (non-fatal):", timelineError);
    }

    return {
        success: true,
        order: {
            id: inserted.id,
            order_number: inserted.order_number,
            total: inserted.total,
            status: inserted.status,
        },
    };
}