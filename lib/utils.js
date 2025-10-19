import { clsx } from "clsx";
import { sign, verify } from "jsonwebtoken";
import { capitalize } from "lodash";
import { twMerge } from "tailwind-merge";
const crypto = require("crypto");
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const generateOTP = () => {
  return crypto.randomInt(1000, 9999);
};

export const generateToken = (data) => {
  const token = sign({ ...data }, process.env.PRIVATE_KEY, {
    expiresIn: "24h",
  });
  return token;
};

export const verifyToken = (token) => {
  try {
    const isValid = verify(token, process.env.PRIVATE_KEY);
    return isValid;
  } catch (error) {
    return false;
  }
};

export const splitMail = (mail, type = "username") => {
  const splited = mail.split("@");
  const newMail = splited[0];
  if (type === "name") {
    return capitalize(newMail);
  } else {
    return newMail;
  }
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
