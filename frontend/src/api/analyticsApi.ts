import axios from "axios";

export async function fetchHistory() {
  const result =
    await axios.get(
      "http://localhost:8000/api/analytics/history"
    );

  return result.data;
}