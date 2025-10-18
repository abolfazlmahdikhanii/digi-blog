import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
 const crypto=require("crypto")
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const generateOTP=()=>{
  return crypto.randomInt(1000,9999)
}