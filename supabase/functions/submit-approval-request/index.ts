import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-aba-partner-key",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Simple API key check — ABA Partner sends this header
    const partnerKey = req.headers.get("x-aba-partner-key");
    if (partnerKey !== Deno.env.get("ABA_PARTNER_API_KEY")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      member_id,
      facility_id,
      facility_name,
      facility_type,
      service_type,
      patient_name,
      patient_id,
      reason,
      covered,
    } = body;

    if (!member_id || !facility_id || !facility_name || !service_type || !patient_name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service-role client — bypasses RLS to look up the member and insert the request
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Resolve member_id → user_id
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("member_id", member_id)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Member not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: request, error: insertError } = await supabase
      .from("approval_requests")
      .insert({
        user_id: user.id,
        facility_id,
        facility_name,
        facility_type: facility_type ?? service_type,
        service_type,
        patient_name,
        patient_id: patient_id ?? null,
        reason: reason ?? "Visit started at reception",
        covered: covered ?? true,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ request_id: request.id }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
