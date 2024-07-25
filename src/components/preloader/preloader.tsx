'use client'
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const Preloader = () => {
    const [showLoader, setShowLoader] = useState(true);
    const [isLoaded, setIsLoaded] = useState<any>(null);

    useEffect(() => {
        window.addEventListener("load", () => {
            setIsLoaded("loaded");
        });

        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {showLoader && (
                <div className={`preloader ${isLoaded}`} id="preloader"><LoadingScreen/></div>
            )}
        </>
    );
};

export default Preloader;