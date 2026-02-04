import { useState } from "react";
import { toast } from "sonner";

export const useDummyMutation = <TInput = any, TData = any>(
  name: string,
  p0: (
    payload: Partial<{
      name: string;
      icon_url: string;
      guide_enabled: boolean;
      guide_show_on_join?: boolean | null;
      guide_header_layout: string;
      guide_header_image: string;
      guide_welcome_message: string;
      resources: { label: string; value: string; url: string }[];
    }>,
  ) => void,
) => {
  const [data, setData] = useState<TData | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = (payload: TInput) => {
    console.log(`[${name}] payload:`, payload);

    setIsPending(true);
    setIsError(false);
    setError(null);

    // fake async request
    setTimeout(() => {
      try {
        // pretend backend returns what you sent
        setData(payload as unknown as TData);
        setIsPending(false);
        toast.success(`${name} updated successfully`);
      } catch (err) {
        setIsPending(false);
        setIsError(true);
        setError(err as Error);
        toast.error(`Failed to update ${name}`);
      }
    }, 800);
  };

  return {
    data,
    mutate,
    isPending,
    isError,
    error,
  };
};
