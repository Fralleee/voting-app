import { SubTitle } from "@/app/_components/sub-title";
import { Title } from "@/app/_components/title";

export default function NotFound() {
  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center gap-3">
      <Title>404</Title>
      <SubTitle>POLL NOT FOUND OR WAS REMOVED</SubTitle>
    </div>
  );
}
