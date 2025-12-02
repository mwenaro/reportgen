'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { School, GraduationCap, BookOpen, Users } from 'lucide-react'

interface PageLoaderProps {
  isLoading: boolean
  message?: string
  progress?: number
  showProgress?: boolean
}

export default function PageLoader({ 
  isLoading, 
  message = "Loading...", 
  progress = 0,
  showProgress = false 
}: PageLoaderProps) {
  const [currentMessage, setCurrentMessage] = useState(message)
  const [animationStep, setAnimationStep] = useState(0)

  const loadingMessages = [
    "Initializing dashboard...",
    "Loading academic data...",
    "Preparing reports...",
    "Almost ready..."
  ]

  useEffect(() => {
    if (!isLoading) return

    const messageInterval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4)
      if (!message || message === "Loading...") {
        setCurrentMessage(loadingMessages[animationStep])
      }
    }, 1000)

    return () => clearInterval(messageInterval)
  }, [isLoading, animationStep, message])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  }

  const iconVariants = {
    hidden: { scale: 0.5, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  }

  const spinVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear' as const
      }
    }
  }

  const waveVariants = {
    wave: {
      pathLength: [0, 1, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 backdrop-blur-sm"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ 
                x: [0, 50, 0], 
                y: [0, -30, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-20 left-20 text-blue-200"
            >
              <BookOpen size={24} />
            </motion.div>
            
            <motion.div
              animate={{ 
                x: [0, -40, 0], 
                y: [0, 40, 0],
                rotate: [0, -15, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-40 right-32 text-indigo-200"
            >
              <Users size={20} />
            </motion.div>
            
            <motion.div
              animate={{ 
                x: [0, 30, 0], 
                y: [0, -20, 0],
                rotate: [0, 20, 0]
              }}
              transition={{ 
                duration: 7, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-40 left-40 text-purple-200"
            >
              <GraduationCap size={28} />
            </motion.div>
          </div>

          {/* Main Loading Content */}
          <motion.div
            variants={itemVariants}
            className="relative z-10 text-center"
          >
            {/* Logo and Main Icon */}
            <motion.div 
              variants={iconVariants}
              className="relative mb-8"
            >
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="w-20 h-20 mx-auto bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <motion.div
                  variants={spinVariants}
                  animate="spin"
                >
                  <School className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Animated Rings */}
              <div className="absolute inset-0 -m-4">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-28 h-28 border-2 border-blue-300 rounded-full"
                />
              </div>
              
              <div className="absolute inset-0 -m-6">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.05, 0.2],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="w-32 h-32 border border-indigo-200 rounded-full"
                />
              </div>
            </motion.div>

            {/* School Name */}
            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Tsagwa Secondary School
              </h1>
              <p className="text-gray-600 text-sm">
                Academic Management System
              </p>
            </motion.div>

            {/* Loading Message */}
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-gray-700 font-medium"
              >
                {currentMessage}
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            {showProgress && (
              <motion.div
                variants={itemVariants}
                className="w-64 mx-auto mb-6"
              >
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{progress}% Complete</p>
              </motion.div>
            )}

            {/* Animated Dots */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center space-x-2"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Animated Wave */}
            <motion.div
              variants={itemVariants}
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
            >
              <svg width="200" height="40" viewBox="0 0 200 40" className="text-blue-300">
                <motion.path
                  d="M0,20 Q50,10 100,20 T200,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  variants={waveVariants}
                  animate="wave"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Loading Spinner Alternative */}
          <motion.div
            variants={itemVariants}
            className="absolute bottom-10 right-10"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}