const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("authToken");

const apiRequest = async (path, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Something went wrong"
    );
  }

  return data;
};

export const createSubscription = async () => {
  return apiRequest("/payments/create-subscription", {
    method: "POST",
  });
};

export const verifySubscription = async (paymentData) => {
  return apiRequest("/payments/verify-subscription", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};