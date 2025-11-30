"use client";
import React from "react";
import { motion } from "framer-motion";

export function Button({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-3 rounded-full font-semibold bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
