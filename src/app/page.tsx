import { Hinge } from "@/components/manifesto/Hinge";
import { TwoStories } from "@/components/manifesto/TwoStories";
import { AtYourDoor } from "@/components/manifesto/AtYourDoor";
import { Burden } from "@/components/manifesto/Burden";
import { ForkMoment } from "@/components/manifesto/ForkMoment";
import { ContentBridge } from "@/components/manifesto/ContentBridge";
import { FinalCTA } from "@/components/manifesto/FinalCTA";
import { ScrollDepth } from "@/components/manifesto/ScrollDepth";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "3X Media — The Reckoning",
  description:
    "We are alive at the tipping point. Technology goes exponential. Structure changes. The self must choose.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <ScrollDepth />
      <Hinge />
      <TwoStories />
      <AtYourDoor />
      <Burden />
      <ForkMoment />
      <ContentBridge />
      <FinalCTA />
    </>
  );
}
