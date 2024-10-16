import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lightenColor } from "../common/lightenColor";


export default function EmployeeWorkEntryModal({
    isOpen,
    onClose,
    children,
    title = "",
    icon = "",
    loadingBtn,
    className = "",
    width = "",
}) {
    const primaryColor = localStorage.getItem("mainColor");
    const mode = localStorage.getItem("theme");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (e.target.classList.contains("modal-overlay")) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            setLoading(false);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isOpen, onClose]);

    const lighterColor = lightenColor(primaryColor, 0.9);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed top-0 left-0 flex items-center justify-center w-full h-full z-[1000] modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(14, 5, 34, 0.30) 0%, rgba(13, 6, 30, 0.60) 100%)",
                    }}
                >
                    <motion.div
                        className={`min-w-[50px] w-[92%] max-w-[800px] p-1 bg-white dark:bg-[#3c3c3c] rounded-2xl shadow-md  overflow-hidden ${className}`}
                        initial={{ opacity: 0, y: "-50%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ opacity: 0, y: "-50%" }}
                        style={{ width: `${width}` }}
                    >
                        <div
                            className="flex flex-col w-full h-full gap-4 p-4 overflow-hidden rounded-xl borderb"
                            style={{
                                background: `${mode === "dark"
                                    ? "linear-gradient(rgb(29 27 36) 0%, rgb(48 45 54) 30.42%, rgba(255, 255, 255, 0) 99.67%)"
                                    : `linear-gradient(180deg, ${lighterColor} 0%, rgba(255, 255, 255, 0.82) 30.42%, rgba(255, 255, 255, 0.00) 99.67%)`
                                    } `,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                {icon && <span>{icon}</span>}
                                {title && <h1 className="h1">{title}</h1>}
                            </div>
                            <>{children}</>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
