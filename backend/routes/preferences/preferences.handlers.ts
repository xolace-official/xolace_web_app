import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { AppRouteHandler } from "../../types";
import type {
  GetPreferencesRoute,
  UpdatePreferencesRoute,
} from "./preferences.routes";

export const getPreferences: AppRouteHandler<GetPreferencesRoute> = async (
  c,
) => {
  const supabase = c.get("supabase");
  const userId = c.get("userId");

  try {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json(
          { message: HttpStatusPhrases.NOT_FOUND },
          HttpStatusCodes.NOT_FOUND,
        );
      }
      throw new Error(error.message);
    }

    return c.json(data, HttpStatusCodes.OK);
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

export const updatePreferences: AppRouteHandler<
  UpdatePreferencesRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const userId = c.get("userId");
  const updateData = c.req.valid("json");

  try {
    const { data, error } = await supabase
      .from("user_preferences")
      .update({ ...updateData })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      return c.json(
        {
          message: "Preferences update failed",
        },
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    return c.json(data, HttpStatusCodes.OK);
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
