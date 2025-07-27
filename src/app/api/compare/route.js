import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { aiResponse, humanResponse, question } = await req.json();

    // Expanded Positive and Negative Words
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "fantastic",
      "positive",
      "wonderful",
      "brilliant",
      "superb",
      "outstanding",
      "remarkable",
      "awesome",
      "favorable",
      "helpful",
      "beneficial",
      "nice",
      "incredible",
      "super",
      "marvelous",
      "extraordinary",
      "success",
      "impressive",
      "best",
      "valuable",
      "optimistic",
      "advantageous",
    ];

    const negativeWords = [
      "bad",
      "poor",
      "terrible",
      "awful",
      "horrible",
      "negative",
      "unhelpful",
      "useless",
      "worse",
      "worst",
      "disappointing",
      "ugly",
      "harmful",
      "unfavorable",
      "ineffective",
      "sad",
      "unpleasant",
      "awful",
      "disastrous",
      "dreadful",
      "unhappy",
      "pathetic",
      "failure",
      "weak",
      "horrid",
      "inferior",
    ];

    // Function to calculate score
    const calculateScore = (response) => {
      let score = 0;
      const lower = response.toLowerCase();

      // 1. Length Score
      if (response.split(" ").length > 12) score += 1; // detailed response

      // 2. Positive Sentiment Score
      positiveWords.forEach((word) => {
        if (lower.includes(word)) score += 1;
      });

      // 3. Negative Sentiment Penalty
      negativeWords.forEach((word) => {
        if (lower.includes(word)) score -= 1;
      });

      // 4. Relevance Score
      const qWords = question.split(" ");
      let relevance = 0;
      qWords.forEach((word) => {
        if (lower.includes(word.toLowerCase())) relevance += 1;
      });
      if (relevance >= 2) score += 1; // relevant to question

      return score;
    };

    const aiScore = calculateScore(aiResponse);
    const humanScore = calculateScore(humanResponse);

    let winner = "Tie";
    if (aiScore > humanScore) winner = "AI";
    if (humanScore > aiScore) winner = "Human";

    return NextResponse.json({
      winner,
      aiScore,
      humanScore,
      reason: `AI scored ${aiScore}, Human scored ${humanScore} based on detail, sentiment, and relevance.`,
    });
  } catch (error) {
    console.error("Comparison API Error:", error);
    return NextResponse.json({ error: "Comparison failed" }, { status: 500 });
  }
}
