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

// Simulated API call
const createCampfire = async (
  formData: FormData,
): Promise<CreateCampfireResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Get form data for logging
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;

  console.log("Creating campfire with data:", {
    name,
    description,
    slug,
    purpose: formData.get("purpose"),
    visibility: formData.get("visibility"),
    rules: formData.get("rules"),
  });

  // Simulate success response
  return {
    success: true,
    data: {
      id: `campfire_${Date.now()}`,
      slug: slug,
      name: name,
    },
    message: "Campfire created successfully!",
  };

  // Uncomment below to simulate error
  // throw new Error('Failed to create campfire');
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
