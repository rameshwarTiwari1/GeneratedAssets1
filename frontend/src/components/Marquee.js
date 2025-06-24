import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
export const Marquee = ({ items, speed = 50, direction = "left", onItemClick, className = "", }) => {
    const marqueeVariants = {
        animate: {
            x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: speed,
                    ease: "linear",
                },
            },
        },
    };
    return (_jsxs("div", { className: `relative w-full overflow-x-hidden whitespace-nowrap ${className}`, children: [_jsx("div", { className: "absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" }), _jsx("div", { className: "absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" }), _jsx(motion.div, { className: "inline-block", variants: marqueeVariants, animate: "animate", children: items.map((text, index) => (_jsx(Button, { variant: "outline", className: "rounded-full mx-2 my-1", onClick: () => onItemClick(text), children: text }, `item-${index}`))) }), _jsx(motion.div, { className: "inline-block", variants: marqueeVariants, animate: "animate", children: items.map((text, index) => (_jsx(Button, { variant: "outline", className: "rounded-full mx-2 my-1", onClick: () => onItemClick(text), children: text }, `duplicate-${index}`))) })] }));
};
