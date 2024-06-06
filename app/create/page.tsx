import { Card } from "@/components/ui/card";
import CreateVoteForm from "./components/create-vote-form";

export default function Page() {
  return (
    <Card className="flex w-full max-w-[640px] flex-col p-12">
      <CreateVoteForm />
    </Card>
  );
}
