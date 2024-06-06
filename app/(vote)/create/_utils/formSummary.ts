export const formSummary = (formValues: any) => {
  const { type, allowMultiChoice, allowChoiceCreation } = formValues;

  let formType: string = allowMultiChoice ? "Multi-choice " : "Single-choice ";
  let formDescription: string[] = [];

  if (type === "poll") {
    formType += "poll";
  } else if (type === "storypoints") {
    formType += "story points session";
  }

  if (allowChoiceCreation) {
    formDescription.push("Users can create options");
  }

  return { formType, formDescription };
};
