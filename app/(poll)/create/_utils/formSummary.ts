export const formSummary = (formValues: any) => {
  const { type, blindVoting, allowMultiChoice, allowChoiceCreation } =
    formValues;

  let formType: string = allowMultiChoice ? "Multi-choice " : "Single-choice ";
  let formDescription: string[] = [];

  if (type === "poll") {
    formType += "poll";
  } else if (type === "storypoints") {
    formType += "story points session";
    return { formType, formDescription };
  }

  if (blindVoting) {
    formDescription.push("Votes are hidden until the poll is closed");
  }

  if (allowChoiceCreation) {
    formDescription.push("Users can create options");
  }

  return { formType, formDescription };
};
