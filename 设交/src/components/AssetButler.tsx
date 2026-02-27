import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Bot, Zap, Flame, TrendingDown, ShieldAlert, BarChart3, MessageSquare, ChevronRight, Loader2, CheckCircle2, MoreHorizontal, User } from "lucide-react";

interface AssetButlerProps {
  onBack: () => void;
  onShowCleanup: () => void;
  onEnterChat?: () => void;
}

export default function AssetButler({ onBack, onShowCleanup, onEnterChat }: AssetButlerProps) {
  const [batchStatus, setBatchStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [showSubDialog, setShowSubDialog] = useState(false);

  const handleBatchLike = () => {
    setBatchStatus('processing');
    setTimeout(() => {
      setBatchStatus('completed');
      setTimeout(() => setBatchStatus('idle'), 2000);
    }, 2000);
  };

  const analysisData = [
    {
      type: "warning",
      icon: <Flame className="text-orange-500" size={20} />,
      title: "火花即将熄灭",
      description: "您与 '十年老友' 的互动频率在过去 72 小时内下降了 85%。",
      action: "立即发送破冰话术",
      color: "border-orange-500/30 bg-orange-500/5",
      onClick: onEnterChat
    },
    {
      type: "maintain",
      icon: <Zap className="text-primary" size={20} />,
      title: "高优维持建议",
      description: "目标 'Sarah_K' 的社交权重正在上升，建议追加 2 次点赞以维持关系排名。",
      action: batchStatus === 'processing' ? "处理中..." : batchStatus === 'completed' ? "已完成" : "执行批量点赞",
      color: "border-primary/30 bg-primary/5",
      onClick: handleBatchLike,
      disabled: batchStatus !== 'idle',
      iconRight: batchStatus === 'processing' ? <Loader2 size={12} className="animate-spin" /> : batchStatus === 'completed' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <ChevronRight size={12} />
    },
    {
      type: "danger",
      icon: <TrendingDown className="text-danger" size={20} />,
      title: "无效资产预警",
      description: "检测到 3 个连接已连续 1000 天无有效数据交换，判定为社交冗余。",
      action: "进入清理程序",
      color: "border-danger/30 bg-danger/5",
      onClick: onShowCleanup
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-hidden relative">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">社交资产管家</h2>
            <p className="text-[10px] text-emerald-500 font-mono">ALGORITHM ACTIVE // V4.2</p>
          </div>
        </div>
      </header>

      {/* Analysis Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">实时社交审计报告</h3>
          <p className="text-lg font-bold text-white leading-tight">
            当前社交带宽占用率：<span className="text-primary">78%</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
            <BarChart3 size={20} className="text-slate-500 mb-2" />
            <p className="text-2xl font-bold text-white">12.4k</p>
            <p className="text-[10px] text-slate-500 uppercase">月度互动值</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
            <ShieldAlert size={20} className="text-danger mb-2" />
            <p className="text-2xl font-bold text-danger">3</p>
            <p className="text-[10px] text-slate-500 uppercase">待处理债务</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">算法优化建议</h3>
          {analysisData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-2xl border ${item.color} space-y-3`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
              <button 
                onClick={item.onClick}
                disabled={(item as any).disabled}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {item.action}
                {(item as any).iconRight || <ChevronRight size={12} />}
              </button>
            </motion.div>
          ))}
        </div>

        <div 
          onClick={() => setShowSubDialog(true)}
          className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 relative overflow-hidden cursor-pointer group active:scale-[0.98] transition-transform"
        >
          <div className="relative z-10">
            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">升级 设交Pro</h4>
            <p className="text-xs text-slate-400">解锁 AI 自动话术生成，让您的社交资产实现被动增长。</p>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <Zap size={48} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Footer Input Mimic */}
      <div className="p-4 bg-slate-900/50 border-t border-white/5">
        <div className="flex items-center gap-3 bg-black/40 rounded-2xl p-3 border border-white/5">
          <MessageSquare size={18} className="text-slate-600" />
          <span className="text-xs text-slate-500">向管家咨询更多优化策略...</span>
        </div>
      </div>

      {/* Subscription Dialog */}
      <AnimatePresence>
        {showSubDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubDialog(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 rounded-3xl p-8 border border-primary/30 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setShowSubDialog(false)} className="text-slate-500 hover:text-white">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
                  <Bot size={40} className="text-primary" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">开启社交全自动化</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    升级 <span className="text-primary font-bold">设交Pro</span>，解锁“管家代聊”功能。算法将根据您的社交画像，自动维护所有高优关系，实现资产 24/7 持续增值。
                  </p>
                  <p className="text-[10px] text-slate-500 italic pt-2">
                    “真正的成功者，从不亲自社交。”
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <button 
                    onClick={() => {
                      alert("支付系统跳转中...\n正在从您的社交信用分中预扣除...");
                      setShowSubDialog(false);
                    }}
                    className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    立即解锁 ¥28/月
                  </button>
                  <button 
                    onClick={() => setShowSubDialog(false)}
                    className="w-full py-3 text-slate-500 text-xs font-medium hover:text-slate-300 transition-colors"
                  >
                    暂不升级，继续手动社交
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

