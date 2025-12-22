import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createServiceSupabase } from "@/lib/supabase/admin";
import type { AppRouteHandler } from "../../types";
import type { GetOwnProfileRoute } from "./profile.routes";

export const getOwnProfile: AppRouteHandler<GetOwnProfileRoute> = async (c) => {
  const adminSupabase = createServiceSupabase();
  const supabase = c.get("supabase");
  const userId = c.get("userId");

  const fetchProfile = async () => {
    const [publicData, privateData] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      adminSupabase
        .from("private.profile_private")
        .select("*")
        .eq("user_id", userId)
        .single(),
    ]);

    if (publicData.error || privateData.error) {
      throw new Error(publicData.error?.message);
    }

    const profile = {
      ...publicData.data,
      ...privateData.data,
    };
    return profile;
  };

  try {
    const profile = await fetchProfile();
    return c.json(profile, HttpStatusCodes.OK);
  } catch (error) {
    console.error(error);
    return c.json(
      {
        message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
