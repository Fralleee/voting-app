import Vote from "./components/vote";

export default function Page({ params }: { params: { id: string } }) {
  return <Vote id={params.id} />;
}
