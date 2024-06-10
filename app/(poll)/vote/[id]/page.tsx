import PollRoot from "./_components/poll/poll-root";

export default function Page({ params }: { params: { id: string } }) {
  return <PollRoot id={params.id} />;
}
