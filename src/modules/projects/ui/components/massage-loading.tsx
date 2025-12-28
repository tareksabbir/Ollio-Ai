import Image from "next/image";
import { useState, useEffect } from "react";
const ShimmerMessages = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Generating...",
    "Analyzing your request...",
    "Building your Website...",
    "Crafting components...",
    "Optimizing layout...",
    "Adding final touches...",
    "Almost ready...",
    "Done! Enjoy your website!",
    "Processing your vision...",
    "Assembling elements...",
    "Fine-tuning details...",
    "Polishing the design...",
    "Configuring features...",
    "Weaving magic...",
    "Bringing it to life...",
    "Perfecting responsiveness...",
    "Adding interactivity...",
    "Finalizing masterpiece...",
    "Initializing AI engine...",
    "Parsing requirements...",
    "Structuring content...",
    "Styling components...",
    "Implementing logic...",
    "Testing compatibility...",
    "Enhancing user experience...",
    "Optimizing performance...",
    "Rendering preview...",
    "Applying best practices...",
    "Calibrating aesthetics...",
    "Integrating animations...",
    "Validating code quality...",
    "Compiling assets...",
    "Synchronizing elements...",
    "Deploying brilliance...",
    "Adding wow factor...",
    "Creating magic moments...",
    "Putting pieces together...",
    "Nearly there...",
    "Brewing creativity...",
    "Architecting structure...",
    "Painting pixels...",
    "Choreographing transitions...",
    "Injecting personality...",
    "Crafting experience...",
    "Building foundation...",
    "Layering sophistication...",
    "Refining interactions...",
    "Harmonizing colors...",
    "Balancing composition...",
    "Sculpting interface...",
    "Establishing hierarchy...",
    "Tuning accessibility...",
    "Constructing framework...",
    "Designing flow...",
    "Engineering elegance...",
    "Calculating precision...",
    "Mixing ingredients...",
    "Baking excellence...",
    "Sprinkling innovation...",
    "Fusing ideas...",
    "Translating concepts...",
    "Mapping journey...",
    "Shaping experience...",
    "Curating content...",
    "Aligning vision...",
    "Cooking up something special...",
    "Channeling inspiration...",
    "Manifesting your idea...",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);
  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

const MessageLoading = () => {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="ollio"
          width={22}
          height={22}
          className="shirink-0"
        />
        <span className="text-sm font-medium">Ollio</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessages />
      </div>
    </div>
  );
};

export default MessageLoading;
