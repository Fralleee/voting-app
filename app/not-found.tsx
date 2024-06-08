import { Title } from "./_components/title";
import { SubTitle } from "./_components/sub-title";

export default function NotFound() {
  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center gap-3">
      <Title>404</Title>
      <SubTitle>PAGE NOT FOUND</SubTitle>
    </div>
  );
}
