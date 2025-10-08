"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Button, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import Link from "next/link";
import { useDemoLoginMutation } from "@/redux/api/books";

import welcomeAnim from "@/public/animations/HelloPeep.json";
import organizeAnim from "@/public/animations/Organise.json";
import choiceAnim from "@/public/animations/choice.json";

const steps = [
  {
    id: 1,
    title: "Welcome to Katalog",
    description:
      "Your personal media tracker for books, movies, games, and more.",
    animation: welcomeAnim,
  },
  {
    id: 2,
    title: "Organize Your Media",
    description: "Track progress, add notes, and visualize your journey.",
    animation: organizeAnim,
  },
  {
    id: 3,
    title: "Get Started",
    description: "Login to save your library or try the demo version first.",
    animation: choiceAnim,
    isFinal: true,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const [demoLogin, { isLoading }] = useDemoLoginMutation();

  const handleDemo = async () => {
    try {
      const res = await demoLogin().unwrap();
      console.log("Demo login success:", res);

      localStorage.setItem("token", res.token);

      router.push("/dashboard");
    } catch (err) {
      console.error("Demo login failed:", err);
    }
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={steps[step].id}
          custom={direction}
          initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -100) nextStep();
            if (info.offset.x > 100) prevStep();
          }}
          style={{ width: "100%" }}
        >
          <Stack spacing={3} alignItems="center">
            <Lottie
              animationData={steps[step].animation}
              loop
              style={{ width: 250, height: 250 }}
            />
            <Typography variant="h4" fontWeight="bold">
              {steps[step].title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {steps[step].description}
            </Typography>
          </Stack>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
        {steps.map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              width: step === i ? 24 : 12,
              backgroundColor: step === i ? "#1976d2" : "#ccc",
            }}
            transition={{ duration: 0.3 }}
            style={{
              height: 12,
              borderRadius: 6,
            }}
          />
        ))}
      </Stack>

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} mt={4}>
        {step > 0 && (
          <Button variant="outlined" onClick={prevStep}>
            Back
          </Button>
        )}
        {!steps[step].isFinal ? (
          <Button variant="contained" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Stack direction="row" spacing={2}>
            <Link href="/auth/login" passHref>
              <Button variant="contained" color="primary">
                Login
              </Button>
            </Link>
            <Link href="/auth/register" passHref>
              <Button variant="contained" color="primary">
                register
              </Button>
            </Link>
            <Button
              variant="outlined"
              onClick={handleDemo}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Try Demo"}
            </Button>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
