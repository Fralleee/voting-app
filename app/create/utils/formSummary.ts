export const formSummary = (formValues: any): string => {
  const { type, allowMultiChoice, allowChoiceCreation } = formValues;
  let response: string = allowMultiChoice ? "Multi-choice " : "Single-choice ";

  if (type === "poll") {
    response += "poll";
  } else if (type === "storypoints") {
    response += "story points session";
  }

  if (allowChoiceCreation) {
    response += ", users can create options.";
  }

  return response;
};
