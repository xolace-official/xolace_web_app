import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createServiceSupabase } from "@/lib/supabase/admin";
import type { AppRouteHandler } from "../../types";
import type {
  GetOwnPrivateProfileRoute,
  GetOwnProfileRoute,
  GetOwnPublicProfileRoute,
  UpdateUserPrivateRoute,
  UpdateUserPublicRoute,
} from "./profile.routes";

export const getOwnProfile: AppRouteHandler<GetOwnProfileRoute> = async (c) => {
  const adminSupabase = createServiceSupabase();
  const supabase = c.get("supabase");
  const userId = c.get("userId");

  const fetchProfile = async () => {
    const [publicData, privateData] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      adminSupabase
        .schema("private")
        .from("profile_private")
        .select("*")
        .eq("user_id", userId)
        .single(),
    ]);
    console.log("publicData", publicData);
    console.log("privateData", privateData);

    if (publicData.error || privateData.error) {
      console.log(publicData.error?.message);
      console.log("private ", privateData.error?.message);
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

export const getOwnPublicProfile: AppRouteHandler<
  GetOwnPublicProfileRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const userId = c.get("userId");

  const fetchPublicProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  try {
    const profileData = await fetchPublicProfile();

    return c.json(profileData, HttpStatusCodes.OK);
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getOwnPrivateProfile: AppRouteHandler<
  GetOwnPrivateProfileRoute
> = async (c) => {
  const supabase = createServiceSupabase();
  const userId = c.get("userId");

  const fetchPrivateProfile = async () => {
    const { data, error } = await supabase
      .schema("private")
      .from("profile_private")
      .select(
        "user_id, consent_version, has_consented, location_country_code, location_region , location_city ",
      )
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  try {
    const profileData = await fetchPrivateProfile();

    return c.json(profileData, HttpStatusCodes.OK);
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const updateUserPublicProfile: AppRouteHandler<
  UpdateUserPublicRoute
> = async (c) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");
  const updateData = c.req.valid("json");

  try {
    // Update the profile
    const { error } = await supabase
      .from("profiles")
      .update({
        ...updateData,
      })
      .match({
        id: userId,
      });

    if (error) {
      return c.json(
        {
          message: "Profile update failed",
        },
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    return c.json(
      {
        message: "Profile updated",
      },
      HttpStatusCodes.OK,
    );
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

export const updateUserPrivateProfile: AppRouteHandler<
  UpdateUserPrivateRoute
> = async (c) => {
  const supabase = createServiceSupabase();
  const userId = c.get("userId");
  const updateData = c.req.valid("json");

  try {
    // Update the profile
    const { error } = await supabase
      .schema("private")
      .from("profile_private")
      .update({
        ...updateData,
      })
      .match({
        user_id: userId,
      });

    if (error) {
      return c.json(
        {
          message: "Profile update failed",
        },
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    return c.json(
      {
        message: "Profile updated",
      },
      HttpStatusCodes.OK,
    );
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
