import Poll from "./_components/poll/poll";

export default function Page({ params }: { params: { id: string } }) {
  return <Poll id={params.id} />;
}
