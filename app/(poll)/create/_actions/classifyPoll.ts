"use server";

import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase";

export const classifyPoll = async (key: string, topic: string) => {
  try {
    const classifyPollUrl = process.env.CLASSIFY_POLL_URL;
    if (!classifyPollUrl) {
      throw new Error("CLASSIFY_POLL_URL is not defined");
    }

    const response = await fetch(classifyPollUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ poll_text: topic }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { category } = await response.json();
    const pollReference = ref(database, `votes/${key}`);
    await update(pollReference, { category });
  } catch (error) {
    console.error("Error classifying poll:", error);
  }
};
