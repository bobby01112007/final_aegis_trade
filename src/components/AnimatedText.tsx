import React from 'react';
import { motion } from 'motion/react';

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * AnimatedContainer triggers a cascading stagger effect on all child elements
 * wrapped with StaggerItem. Perfect for display typography / headers.
 */
export const StaggeredContainer: React.FC<AnimatedTitleProps> = ({ children, className = '', delay = 0 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay,
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem defines a smooth fade-and-rise transition to be used inside StaggeredContainer.
 */
export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.span variants={itemVariants} className={`inline-block ${className}`}>
      {children}
    </motion.span>
  );
};

/**
 * RevealText fades and slides a single block of content with custom timing controls.
 */
export const RevealText: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * TypewriterText typographs text with a smooth character pacing stream and an elegant gold cursor caret.
 */
export const TypewriterText: React.FC<{ text: string; delay?: number; speed?: number; className?: string }> = ({ text, delay = 0, speed = 40, className = '' }) => {
  const [displayedText, setDisplayedText] = React.useState('');

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const start = () => {
      let currentIdx = 0;
      interval = setInterval(() => {
        if (currentIdx < text.length) {
          setDisplayedText((prev) => prev + text.charAt(currentIdx));
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, speed);
    };
    
    timeout = setTimeout(start, delay * 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, speed]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
        className="inline-block w-[2px] h-[1em] ml-1.5 bg-[#d4af37] align-middle"
      />
    </span>
  );
};

/**
 * ScrambleText gives an high-tech cryptographic reveal effect cycling random glyphs until the string resolves.
 */
export const ScrambleText: React.FC<{ text: string; delay?: number; duration?: number; className?: string }> = ({ text, delay = 0, duration = 1.0, className = '' }) => {
  const [displayText, setDisplayText] = React.useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%&#@*+-';

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let frameId: number;
    let startTime: number;

    const startScrambling = () => {
      startTime = Date.now();
      const scramble = () => {
        const timePassed = (Date.now() - startTime) / 1000;
        const progress = Math.min(timePassed / duration, 1);

        const currentPart = text.split('').map((char, index) => {
          if (char === ' ') return ' ';
          const charProgress = index / text.length;
          if (progress > charProgress) {
            return char;
          }
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        setDisplayText(currentPart);

        if (progress < 1) {
          frameId = requestAnimationFrame(scramble);
        } else {
          setDisplayText(text);
        }
      };
      
      frameId = requestAnimationFrame(scramble);
    };

    timeoutId = setTimeout(startScrambling, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [text, delay, duration]);

  return <span className={className}>{displayText}</span>;
};

/**
 * WordFadeIn animates each word of a sentence/paragraph incrementally with micro stagger.
 */
export const WordFadeIn: React.FC<{ children: string; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const words = children.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={wordVariants}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

/**
 * GradualSpacing displays text with letters smoothly expanding outward from high density.
 */
export const GradualSpacing: React.FC<{ children: string; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const containerVariants = {
    hidden: { letterSpacing: '-0.12em', opacity: 0 },
    visible: {
      letterSpacing: '0.04em',
      opacity: 1,
      transition: {
        duration: 1.2,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
};
