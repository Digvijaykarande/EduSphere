// src/lib/formatCurrency.js

export function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
