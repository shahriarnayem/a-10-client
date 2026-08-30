const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
 
export async function exchangeFirebaseToken(firebaseIdToken) {
  const response = await fetch(`${API_URL}/api/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${firebaseIdToken}`,
    },
  });
 
  const data = await response.json();
 
  if (!response.ok) {
    throw new Error(data.message || "The marketplace session could not be created.");
  }
 
  return data;
}
