import { useEffect } from "react";

export const useWarnIfUnsavedChanges = (unsaved: boolean) => {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const targetUrl = (e.currentTarget as HTMLAnchorElement).href;
      const currentUrl = window.location.href;
      if (targetUrl !== currentUrl) {
        if (window.onbeforeunload) {
          const res = window.onbeforeunload(e);
          if (!res) {
            e.preventDefault();
          }
        }
      }
    };

    const handleMutation = () => {
      const anchorElements = document.querySelectorAll(
        "a[href]",
      ) as NodeListOf<HTMLAnchorElement>;
      anchorElements.forEach((anchor) =>
        anchor.addEventListener("click", handleAnchorClick),
      );
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document, { childList: true, subtree: true });

    // dont know if needed or not but it works
    return () => {
      mutationObserver.disconnect();
      const anchorElements = document.querySelectorAll(
        "a[href]",
      ) as NodeListOf<HTMLAnchorElement>;
      anchorElements.forEach((anchor) =>
        anchor.removeEventListener("click", handleAnchorClick),
      );
    };
  }, []);

  // @ts-expect-error -- We don't need to specify parameters
  useEffect(() => {
    const beforeUnloadHandler = () => {
      const yes = confirm(
        "Changes you made has not been saved just yet. Do you wish to proceed anyway?",
      );

      // you can use this condition for something, example: if you have progressbar setup you might want to cancel the animation
      // if (!yes) cancelProgressbar();

      return yes;
    };
    window.onbeforeunload = unsaved ? beforeUnloadHandler : null;

    return () => (window.onbeforeunload = null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unsaved]);
};
