'use client';

import { motion } from 'framer-motion';
import React from 'react';
import ReactMarkdown from 'react-markdown';

type ChatMarkdownPropsType = {
  text: string;
};
export const ChatMarkdown = ({ text }: ChatMarkdownPropsType) => {
  return (
    <motion.div
      className="chatMarkdown"
      initial={{ rotate: 180, scale: 0 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 560,
        damping: 20,
        duration: 1,
      }}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </motion.div>
  );
};
