import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useMemo, memo } from "react";

function Fireflies() {
    const particles = useMemo(() => {
        return Array.from({ length: 35 }).map(() => ({
            size: Math.random() * 2 + 1.5,
            duration: 2 + Math.random() * 2,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            startX: Math.random() * window.innerWidth,
            startY: Math.random() * window.innerHeight
        }));
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {particles.map((p, i) => (
                <Firefly key={i} data={p} />
            ))}
        </div>
    );
}

const Firefly = memo(function Firefly({ data }) {
    const x = useMotionValue(data.startX);
    const y = useMotionValue(data.startY);

    const smoothX = useSpring(x, { stiffness: 20, damping: 30 });
    const smoothY = useSpring(y, { stiffness: 20, damping: 30 });

    const velocity = useRef({
        vx: data.vx,
        vy: data.vy
    });

    useEffect(() => {
        let mouse = { x: 0, y: 0 };

        const handleMove = (e) => {
            mouse = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("mousemove", handleMove);

        let animationFrame;

        const move = () => {
            let currentX = x.get();
            let currentY = y.get();

            currentX += velocity.current.vx;
            currentY += velocity.current.vy;

            velocity.current.vx += (Math.random() - 0.5) * 0.02;
            velocity.current.vy += (Math.random() - 0.5) * 0.02;

            velocity.current.vx = Math.max(-1, Math.min(1, velocity.current.vx));
            velocity.current.vy = Math.max(-1, Math.min(1, velocity.current.vy));

            const dx = currentX - mouse.x;
            const dy = currentY - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const maxDistance = 130;

            if (distance < maxDistance && distance > 0) {
                const force = (maxDistance - distance) / maxDistance;

                currentX += (dx / distance) * force * 2;
                currentY += (dy / distance) * force * 2;
            }

            if (currentX <= 0 || currentX >= window.innerWidth) {
                velocity.current.vx *= -1;
            }

            if (currentY <= 0 || currentY >= window.innerHeight) {
                velocity.current.vy *= -1;
            }

            x.set(currentX);
            y.set(currentY);

            animationFrame = requestAnimationFrame(move);
        };

        move();

        return () => {
            window.removeEventListener("mousemove", handleMove);
            cancelAnimationFrame(animationFrame);
        };
    }, [x, y]);

    return (
        <motion.div
            style={{
                position: "absolute",
                width: data.size,
                height: data.size,
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow:
                    "0 0 8px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)",
                x: smoothX,
                y: smoothY
            }}
            animate={{
                opacity: [0.2, 1, 0.3],
                scale: [1, 1.3, 1]
            }}
            transition={{
                duration: data.duration, // ✅ stable
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
});

export default memo(Fireflies);