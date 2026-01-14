import { GlimpseInterface } from "@/features/health-space/glimpse/index";

export const GlimpseDetails = ({ glimpse }: { glimpse: GlimpseInterface }) => {
  return <div>{glimpse.id}</div>;
};
