import Prompts from "./_components/prompts";
import { Title } from "./_components/title";
import { getRandomTitle } from "./_utils/getRandomTitle";
import { PollButton } from "./_components/poll-button";
import { Gradient } from "./_components/gradient";

export const dynamic = "force-dynamic";

export default function Page() {
  const title = getRandomTitle();
  return (
    <div className="flex h-full w-full flex-col items-center gap-6 py-12 pt-20 md:h-auto md:px-8 md:pb-64">
      <Title>{title}</Title>
      <Gradient />
      <PollButton />
      <Prompts />
    </div>
  );
}
