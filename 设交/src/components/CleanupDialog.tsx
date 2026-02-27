import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, List, BatteryCharging, BatteryLow, BatteryMedium, BatteryWarning, Trash2, Zap, X, Info, Loader2, ShieldAlert } from "lucide-react";

export default function CleanupDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [nodes, setNodes] = useState([
    {
      id: 1,
      name: "高中同学 A",
      reason: "1095天无互动",
      avatar: "https://picsum.photos/seed/user1/100/100",
      status: "inactive"
    },
    {
      id: 2,
      name: "前同事 B",
      reason: "仅存在于点赞记录",
      avatar: "https://picsum.photos/seed/user2/100/100",
      status: "low"
    },
    {
      id: 3,
      name: "路人甲",
      reason: "社交评级：E (无价值)",
      avatar: "https://picsum.photos/seed/user3/100/100",
      status: "warning"
    }
  ]);

  const [isPurging, setIsPurging] = useState(false);
  const [purgeProgress, setPurgeProgress] = useState(0);

  useEffect(() => {
    if (nodes.length === 0 && !isPurging) {
      const timer = setTimeout(onClose, 800);
      return () => clearTimeout(timer);
    }
  }, [nodes.length, isPurging, onClose]);

  if (!isOpen) return null;

  const handleDeleteNode = (id: number) => {
    setNodes(prev => prev.filter(n => n.id !== id));
  };

  const handlePurgeAll = () => {
    setIsPurging(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setPurgeProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setNodes([]);
          setIsPurging(false);
          onClose();
        }, 500);
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Purging Overlay */}
        <AnimatePresence>
          {isPurging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                  filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="mb-6 text-danger"
              >
                <ShieldAlert size={64} />
              </motion.div>
              <h4 className="text-xl font-bold text-white mb-2">正在执行：社交资产处决</h4>
              <p className="text-xs text-slate-500 font-mono mb-6">正在从您的生物神经网络中擦除低价值连接...</p>
              
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${purgeProgress}%` }}
                  className="h-full bg-danger shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                />
              </div>
              <p className="mt-2 text-[10px] font-mono text-danger animate-pulse">
                {purgeProgress}% COMPLETE - PURGING DATA...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-1 w-full bg-gradient-to-r from-transparent via-danger to-transparent opacity-80" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6 pb-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-danger">
            <Zap size={24} fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-display">算法建议：社交资产清理</h3>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            检测到以下 <span className="text-danger font-bold">{nodes.length}</span> 个低价值数据节点，建议断开连接以节省社交带宽。
          </p>
        </div>

        <div className="px-4 py-2 flex flex-col gap-3 min-h-[200px]">
          <AnimatePresence mode="popLayout">
            {nodes.map((node) => (
              <motion.div 
                key={node.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                className="flex items-center justify-between p-3 rounded-lg bg-[#141414] border border-white/5 group hover:border-danger/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={node.avatar} 
                      alt={node.name}
                      className="h-10 w-10 rounded-full grayscale opacity-60 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#141414] rounded-full p-[2px]">
                      {node.status === 'warning' ? <Info size={12} className="text-danger" /> : <Info size={12} className="text-slate-500" />}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-300 text-sm font-medium">{node.name}</span>
                    <span className={`text-xs font-mono tracking-wide ${node.status === 'warning' ? 'text-danger font-bold' : 'text-slate-500'}`}>
                      {node.reason}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteNode(node.id)}
                  className="text-slate-600 hover:text-danger transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {nodes.length === 0 && !isPurging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-emerald-500 gap-2"
            >
              <CheckCircle2 size={32} />
              <p className="text-xs font-mono">社交带宽已优化</p>
            </motion.div>
          )}
        </div>

        <div className="p-6 pt-4 flex flex-col gap-3">
          <button 
            onClick={handlePurgeAll}
            disabled={nodes.length === 0}
            className="group w-full bg-[#2a2a2a] hover:bg-[#333] border border-danger/50 text-danger rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={18} className="group-hover:animate-pulse" />
            <span className="text-sm font-bold tracking-wide">一键断开所有低效连接</span>
          </button>
          <button 
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-400 font-mono text-center hover:underline decoration-danger/50 underline-offset-4 cursor-pointer transition-colors"
          >
            稍后手动处决 →
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-danger/20 to-transparent" />
      </motion.div>
    </div>
  );
}

import { CheckCircle2 } from "lucide-react";

