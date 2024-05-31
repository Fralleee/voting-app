import Vote from "./components/vote";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <Vote id={params.id} />
    </div>
  );
}
