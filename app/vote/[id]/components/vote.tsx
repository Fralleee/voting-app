"use client";

import React, { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";

interface VoteOption {
  value: string;
}

interface Vote {
  name: string;
  options: VoteOption[];
}

interface VoteProps {
  id: string;
}

const Vote: React.FC<VoteProps> = ({ id }) => {
  const [vote, setVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVote = async () => {
      try {
        const voteRef = ref(database, `votes/${id}`);
        const snapshot = await get(voteRef);
        if (snapshot.exists()) {
          setVote(snapshot.val() as Vote);
        } else {
          setError("No vote found for this ID");
        }
      } catch (err) {
        console.error("Error fetching vote:", err);
        setError("Failed to fetch vote");
      } finally {
        setLoading(false);
      }
    };

    fetchVote();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!vote) return <div>No vote data available.</div>;

  return (
    <div>
      {/* <pre>{JSON.stringify(vote.options, null, 2)}</pre> */}
      <h1>Vote: {vote.name}</h1>
      <ul>
        {vote.options.map((option, index) => (
          <li key={index}>{option.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default Vote;
