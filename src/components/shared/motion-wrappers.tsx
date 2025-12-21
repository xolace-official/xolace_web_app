"use client";

import { type HTMLMotionProps, motion } from "motion/react";

/**
 * Nice motion wrappers for common html elements that can be used in server components so we dont have to turn the whole page or component to Client Component
 */

export function MotionDiv(props: HTMLMotionProps<"div">) {
  return <motion.div {...props}>{props.children}</motion.div>;
}

export function MotionP(props: HTMLMotionProps<"p">) {
  return <motion.p {...props}>{props.children}</motion.p>;
}

export function MotionButton(props: HTMLMotionProps<"button">) {
  return <motion.button {...props}>{props.children}</motion.button>;
}

export function MotionSection(props: HTMLMotionProps<"section">) {
  return <motion.section {...props}>{props.children}</motion.section>;
}

// More can be added as needed
