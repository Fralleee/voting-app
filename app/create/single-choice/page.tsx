import { Card } from "@/components/ui/card";
import CreateVoteForm from "./components/create-vote-form";

export default function Page() {
  return (
    <Card className="flex flex-col p-12 w-full max-w-96">
      <CreateVoteForm />
    </Card>
  );
}
