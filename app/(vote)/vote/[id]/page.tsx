import Vote from "./_components/vote";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center gap-3">
      <Vote id={params.id} />
    </div>
  );
}
