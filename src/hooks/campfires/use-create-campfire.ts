import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateCampfireResponse {
  success: boolean;
  data?: {
    id: string;
    slug: string;
    name: string;
  };
  message?: string;
}

// TODO: Replace this mock with the real API integration
const createCampfire = async (
  formData: FormData,
): Promise<CreateCampfireResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (process.env.NODE_ENV === "development") {
    console.log("Creating campfire with data:", {
      name,
      slug,
      realm: formData.get("realm"),
      visibility: formData.get("visibility"),
      rules: formData.get("rules"),
    });
  }

  return {
    success: true,
    data: {
      id: `campfire_${Date.now()}`,
      slug,
      name,
    },
    message: "Campfire created successfully!",
  };
};

export const useCreateCampfireMutation = () => {
  return useMutation({
    mutationFn: createCampfire,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Campfire created successfully! 🔥");
      }
    },
    onError: (error: Error) => {
      console.error("Error creating campfire:", error);
      toast.error(
        error.message || "Failed to create campfire. Please try again.",
      );
    },
  });
};
