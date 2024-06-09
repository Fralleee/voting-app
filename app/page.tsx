import Prompts from "./_components/prompts";
import { Title } from "./_components/title";
import { getRandomTitle } from "./_utils/getRandomTitle";
import { PollButton } from "./_components/poll-button";
import { Gradient } from "./_components/gradient";

export const dynamic = "force-dynamic";

export default function Page() {
  const title = getRandomTitle();
  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center gap-3">
      <Title>{title}</Title>
      <Gradient />
      <PollButton />
      <Prompts />
    </div>
  );
}
