"use server";

// TODO: Create help_center table in Supabase and uncomment the database insert
// import { createClient } from "@/lib/supabase/server";

export async function submitHelpCenterQuestion(question: string) {
  if (!question || question.length < 8) {
    return { error: "Question must be at least 8 characters." };
  }

  if (question.length > 500) {
    return { error: "Question must be 500 characters or fewer." };
  }

  // TODO: Uncomment when help_center table is created
  // const supabase = await createClient();
  // const { error } = await supabase.from("help_center").insert({ question });
  // if (error) {
  //   console.error("Help center submission error:", error);
  //   return { error: "Something went wrong. Please try again." };
  // }

  // For now, just log the question
  console.log("Help center question received:", question);

  return { success: true };
}
