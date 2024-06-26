export const aliasToAvatar = (alias: string) => {
  if (!alias) return;
  const words = alias.split(" ");
  return (
    words[0].charAt(0) + (words[1] ? words[1].charAt(0) : "")
  ).toUpperCase();
};
