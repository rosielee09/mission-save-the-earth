// src/scenes/Intro/IntroScene.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./IntroScene.css";

const ASSETS = {
	background: "/background/Intro-bg.png",

	logo: "/logo.png",

	sun: "/characters/sun.png",

	earthHappy: "/characters/earth-with-tree.png",
	earthSad: "/characters/earth-sad.png",
	earthSuffer: "/characters/earth-suffer.png",

	startButton: "/buttons/start-button.png",
	btnYes: "/buttons/yes-button.png",
	btnNo: "/buttons/no-button.png",

	speechBubble: "/ui/speech-bubble.png",
};

const IntroScene = () => {
	// Our "state machine" to control the scene's flow
	const [sceneState, setSceneState] = useState("IDLE"); // 'IDLE' | 'GREETING' | 'HEATING' | 'QUESTION'

	// State for assets that change
	const [earthImage, setEarthImage] = useState(ASSETS.earthHappy); // Use earthHappy
	const [bubbleText, setBubbleText] = useState("");

	// This `useEffect` is the "director" that calls the next scene
	useEffect(() => {
		// Use cancellable timers and ensure cleanup when sceneState changes
		const timers = [];

		if (sceneState === "GREETING") {
			// Show "Hi there!" for 3 seconds
			setBubbleText("Hi there! I'm Earth!");

			timers.push(
				setTimeout(() => {
					setSceneState("HEATING");
				}, 3000)
			);
		}

		if (sceneState === "HEATING") {
			// Start the "heating" sequence
			// 1. Change text, Earth starts getting sad
			timers.push(
				setTimeout(() => {
					setBubbleText(
						"Lately, I've been getting really hot."
					);
					setEarthImage(ASSETS.earthSad); // Change to earthSad
				}, 500)
			);

			// 2. Earth starts to suffer
			timers.push(
				setTimeout(() => {
					setEarthImage(ASSETS.earthSuffer); // Change to earthSuffer
				}, 3000)
			);

			// 3. Show the question
			timers.push(
				setTimeout(() => {
					setSceneState("QUESTION");
				}, 4000)
			);
		}

		return () => timers.forEach((t) => clearTimeout(t));
	}, [sceneState]); // This effect re-runs whenever sceneState changes

	// trees were removed from the project - no-op here

	// Background class is controlled by the router (App.jsx)

	// Animated bubble text component (letters appear one-by-one)
	const AnimatedBubbleText = ({ text }) => {
		const container = {
			hidden: {},
			visible: {
				transition: {
					staggerChildren: 0.03,
					delayChildren: 0.05,
				},
			},
		};

		const letter = {
			hidden: { opacity: 0, y: 6 },
			visible: {
				opacity: 1,
				y: 0,
				transition: { duration: 0.06, ease: "easeOut" },
			},
		};

		// render spans for each character (preserve spaces)
		return (
			<motion.p
				className='bubble-text'
				variants={container}
				initial='hidden'
				animate='visible'
			>
				{Array.from(text).map((ch, i) => (
					<motion.span
						key={i}
						variants={letter}
						aria-hidden
					>
						{ch === " " ? "\u00A0" : ch}
					</motion.span>
				))}
				<span className='sr-only'>{text}</span>
			</motion.p>
		);
	};

	return (
		<div className='intro-container'>
			<div className='intro-layout'>
				<div className='left-column'>
					{/* Earth: cross-fade between images for smooth transitions */}
					<AnimatePresence mode='wait'>
						<motion.img
							key={earthImage}
							src={earthImage}
							alt='Earth'
							className='earth'
							initial={{
								opacity: 0,
								scale: 0.96,
								filter: "blur(3px) saturate(0.7)",
							}}
							animate={{
								opacity: 1,
								scale: 1,
								filter: "blur(0px) saturate(1)",
								rotate:
									sceneState ===
									"GREETING"
										? [
												0,
												-8,
												8,
												-8,
												0,
										  ]
										: 0,
								y: [0, -14, 0],
							}}
							exit={{
								opacity: 0,
								scale: 0.96,
								filter: "blur(3px) saturate(0.6)",
								transition: {
									duration: 0.6,
								},
							}}
							transition={{
								duration: 0.6,
								y: {
									duration: 2,
									repeat: Infinity,
									repeatType: "mirror",
									ease: "easeInOut",
								},
								rotate: {
									duration: 1.5,
									repeat:
										sceneState ===
										"GREETING"
											? 1
											: 0,
								},
							}}
						/>
					</AnimatePresence>
				</div>

				<div className='right-column'>
					{/* IDLE: logo + start button on right column */}
					<AnimatePresence>
						{sceneState === "IDLE" && (
							<motion.div
								className='idle-screen'
								key='idle-screen'
								exit={{
									opacity: 0,
									transition: {
										duration: 0.5,
									},
								}}
							>
								<motion.img
									src={
										ASSETS.logo
									}
									alt='Logo'
									className='logo'
									initial={{
										opacity: 0,
										y: -20,
									}}
									animate={{
										opacity: 1,
										y: 0,
										transition: {
											delay: 0.3,
										},
									}}
								/>

								<motion.img
									src={
										ASSETS.startButton
									}
									alt='Start'
									className='start-button'
									onClick={() =>
										setSceneState(
											"GREETING"
										)
									}
									initial={{
										opacity: 0,
										scale: 0.8,
									}}
									animate={{
										opacity: 1,
										scale: 1,
										transition: {
											delay: 0.8,
										},
									}}
									whileHover={{
										scale: 1.05,
									}}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Sun, speech bubble, and popup overlay as before (positioned absolutely) */}
			<AnimatePresence>
				{sceneState === "HEATING" && (
					<motion.img
						key='sun'
						src={ASSETS.sun}
						alt='Sun'
						className='sun'
						initial={{
							opacity: 0,
							scale: 0.5,
							y: -100,
						}}
						animate={{
							opacity: 1,
							scale: 4,
							y: 0,
						}}
						transition={{ duration: 5 }}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{(sceneState === "GREETING" ||
					sceneState === "HEATING") && (
					<motion.div
						key={bubbleText}
						className='speech-bubble'
						style={{
							backgroundImage: `url(${ASSETS.speechBubble})`,
						}}
						initial={{
							opacity: 0,
							scale: 0.5,
						}}
						animate={{
							opacity: 1,
							scale: 1,
						}}
						exit={{ opacity: 0 }}
					>
						{bubbleText && (
							<AnimatedBubbleText
								text={
									bubbleText
								}
							/>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{sceneState === "QUESTION" && (
					<motion.div
						className='popup-overlay'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<div className='popup-content'>
							<h3>
								Can you guess
								why I'm
								sweating?
							</h3>
							<div className='popup-buttons'>
								<motion.img
									src={
										ASSETS.btnYes
									}
									alt='Yes'
									whileHover={{
										scale: 1.1,
									}}
									onClick={() =>
										console.log(
											"Clicked YES"
										)
									}
								/>
								<motion.img
									src={
										ASSETS.btnNo
									}
									alt='No'
									whileHover={{
										scale: 1.1,
									}}
									onClick={() =>
										console.log(
											"Clicked NO"
										)
									}
								/>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default IntroScene;
