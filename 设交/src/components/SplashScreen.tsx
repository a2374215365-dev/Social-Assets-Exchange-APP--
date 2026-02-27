import { motion } from "motion/react";
import { useEffect } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-white dark:bg-background-dark py-12"
    >
      <div className="flex-1" />
      
      <div className="flex flex-col items-center justify-center w-full max-w-sm px-6 gap-8 z-10">
        <div className="relative flex flex-col items-center justify-center h-40 w-40">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-[120px] h-[60px] border-t-[12px] border-l-[12px] border-r-[12px] border-primary rounded-t-[120px] -translate-x-2.5" 
          />
          <div className="h-4" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-[120px] h-[60px] border-b-[12px] border-l-[12px] border-r-[12px] border-primary rounded-b-[120px] translate-x-2.5" 
          />
        </div>

        <div className="flex flex-col items-center space-y-2 text-center mt-4">
          <h1 className="text-slate-900 dark:text-white tracking-tighter text-[40px] font-bold leading-tight select-none font-display">
            设交
          </h1>
          <div className="h-[1px] w-8 bg-primary/40 my-2" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-widest uppercase">
            Social Asset Exchange
          </p>
        </div>
      </div>

      <div className="flex-1" />

      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#135bec 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    </motion.div>
  );
}
