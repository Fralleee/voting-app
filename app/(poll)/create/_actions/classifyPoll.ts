"use server";

import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase";

export const classifyPoll = async (key: string, topic: string) => {
  try {
    console.log("Classifying poll");
    const classifyPollUrl = process.env.CLASSIFY_POLL_URL;
    console.log("Classify poll url: " + classifyPollUrl);
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
    console.log("Response");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { category } = await response.json();

    console.log("Category found: " + category);
    const pollReference = ref(database, `votes/${key}`);
    await update(pollReference, { category })
      .then(() => {
        console.log("Poll category updated successfully");
      })
      .catch((error) => {
        console.error("Error updating poll category:", error);
      });
  } catch (error) {
    console.error("Error classifying poll:", error);
  }
};
