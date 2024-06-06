import Prompts from "./_components/prompts";
import { Title } from "./_components/title";
import { getRandomTitle } from "./_utils/getRandomTitle";
import { VoteButton } from "./_components/vote-button";
import { Gradient } from "./_components/gradient";

export const dynamic = "force-dynamic";

export default function Page() {
  const title = getRandomTitle();
  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center gap-8 py-8">
      <Title>{title}</Title>
      <Gradient />
      <VoteButton />
      <Prompts />
    </div>
  );
}
