import { Title } from "./_components/title";
import { SubTitle } from "./_components/sub-title";
import { HomeButton } from "./_components/home-button";

export default function NotFound() {
  return (
    <div className="flex w-full flex-grow flex-col items-center justify-center gap-3">
      <Title>404</Title>
      <SubTitle>Page not found</SubTitle>
      <HomeButton />
    </div>
  );
}
