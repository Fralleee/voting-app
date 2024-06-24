import PollRoot from "./_components/poll/poll-root";

namespace Page {
  export interface Props {
    params: { id: string };
  }
}

export default function Page({ params }: Page.Props) {
  return <PollRoot id={params.id} />;
}
