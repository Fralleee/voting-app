export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col items-center justify-center flex-grow gap-8">{children}</div>;
}
