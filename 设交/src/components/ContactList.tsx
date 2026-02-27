import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HardDrive, Settings, TrendingUp, PieChart, Link as LinkIcon, Bolt, Delete, Calendar, History, Send, Handshake, ChevronDown, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";

interface ContactListProps {
  onViewProfile?: (user: any) => void;
  onEnterChat?: () => void;
  onShowCleanup?: () => void;
}

export default function ContactList({ onViewProfile, onEnterChat, onShowCleanup }: ContactListProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [batchStatus, setBatchStatus] = useState<'idle' | 'processing' | 'completed'>('idle');

  const handleAvatarClick = (name: string, avatar: string) => {
    if (onViewProfile) {
      onViewProfile({
        name,
        avatar,
        level: "LVL " + (Math.floor(Math.random() * 99) + 1),
        bio: "这是一个量化社交资产的样本个人简介。"
      });
    }
  };

  const handleAction = (action: string) => {
    if (action === "社交资产清理") {
      onShowCleanup?.();
    } else if (action === "批量点赞群发") {
      setShowBatchDialog(true);
      setBatchStatus('idle');
    } else {
      alert(`正在执行：${action}\n系统正在优化社交资产分配...`);
    }
  };

  const startBatchProcess = () => {
    setBatchStatus('processing');
    setTimeout(() => {
      setBatchStatus('completed');
    }, 2000);
  };

  const highPriority = [
    {
      id: 1,
      name: "Sarah_K",
      avatar: "https://picsum.photos/seed/sarah/100/100",
      returnRate: "+14%",
      days: 105,
      progress: 85,
      status: "关系即将衰退",
      isSVIP: true
    },
    {
      id: 2,
      name: "M_总监",
      avatar: "https://picsum.photos/seed/manager/100/100",
      returnRate: "稳定",
      lastPing: "4小时前",
      progress: 45,
      status: "需要维护",
      isAsset: true
    }
  ];

  const likeContacts = [
    { id: 101, name: "小王", avatar: "https://picsum.photos/seed/wang/100/100", sub: "点赞机器人" },
    { id: 102, name: "阿强", avatar: "https://picsum.photos/seed/qiang/100/100", sub: "互赞群友" },
    { id: 103, name: "Lily", avatar: "https://picsum.photos/seed/lily/100/100", sub: "朋友圈常客" }
  ];

  const historyContacts = [
    { id: 201, name: "前同事A", avatar: "https://picsum.photos/seed/a/100/100", sub: "已离职 3 年" },
    { id: 202, name: "某活动认识的B", avatar: "https://picsum.photos/seed/b/100/100", sub: "无互动记录" }
  ];

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <header className="flex flex-col gap-4 p-4 pb-2 sticky top-0 z-10 border-b border-white/5 bg-background-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-primary">
              <HardDrive size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-widest leading-none font-display">物化联系人列表</h2>
              <p className="text-[10px] text-slate-500 font-mono mt-1">系统版本 4.0.2 // 已连接</p>
            </div>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-500 hover:text-primary transition-colors">
            <Settings size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-slate-900/50 p-3 relative overflow-hidden group">
            <div className="absolute right-2 top-2 text-slate-800 opacity-20 group-hover:opacity-40 transition-opacity">
              <TrendingUp size={36} />
            </div>
            <p className="text-3xl font-bold tracking-tight text-primary font-display">842</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">社交资本</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-slate-900/50 p-3 relative overflow-hidden group">
            <div className="absolute right-2 top-2 text-slate-800 opacity-20 group-hover:opacity-40 transition-opacity">
              <PieChart size={36} />
            </div>
            <p className="text-3xl font-bold tracking-tight text-emerald-500 font-display">92%</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">关系权益</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => handleAction("新的数据节点")}
            className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary pl-3 pr-4 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            <LinkIcon size={16} className="text-white" />
            <span className="text-white text-[10px] font-bold uppercase tracking-wide">新的数据节点</span>
          </button>
          <button 
            onClick={() => handleAction("批量点赞群发")}
            className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-800 pl-3 pr-4 border border-transparent hover:border-slate-700 transition-colors"
          >
            <Bolt size={16} className="text-amber-500" />
            <span className="text-slate-200 text-[10px] font-bold uppercase tracking-wide">批量点赞群发</span>
          </button>
          <button 
            onClick={() => handleAction("社交资产清理")}
            className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-800 pl-3 pr-4 border border-transparent hover:border-danger/30 transition-colors group"
          >
            <Delete size={16} className="text-slate-500 group-hover:text-danger transition-colors" />
            <span className="text-slate-200 text-[10px] font-bold uppercase tracking-wide">社交资产清理</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Bolt size={14} className="text-amber-500 fill-current" />
              高优维持对象
            </h3>
            <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">3/5 槽位</span>
          </div>
          
          <div className="space-y-3">
            {highPriority.map((target) => (
              <motion.div 
                key={target.id}
                whileHover={{ scale: 1.01 }}
                onClick={onEnterChat}
                className="relative rounded-3xl bg-[#151e29] p-4 shadow-sm border border-white/5 flex items-center gap-4 cursor-pointer"
              >
                <div 
                  className="relative shrink-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAvatarClick(target.name, target.avatar);
                  }}
                >
                  <div className={`h-14 w-14 rounded-full overflow-hidden border-2 p-0.5 ${target.isSVIP ? 'border-amber-500' : 'border-primary'}`}>
                    <img src={target.avatar} alt={target.name} className="h-full w-full rounded-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#151e29] ${target.isSVIP ? 'bg-amber-500 text-black' : 'bg-primary text-white'}`}>
                    {target.isSVIP ? 'SVIP' : '资产'}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white truncate text-sm">目标：{target.name}</h4>
                    <span className={`text-[10px] font-bold ${target.returnRate.includes('+') ? 'text-emerald-500' : 'text-slate-400 font-mono'}`}>
                      {target.returnRate.includes('+') ? `${target.returnRate} 回报率` : target.returnRate}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                    {target.days ? <Calendar size={12} /> : <History size={12} />}
                    <span>{target.days ? `连续互动：${target.days} 天` : `上次 Ping：${target.lastPing}`}</span>
                  </div>
                  <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${target.progress}%` }}
                      className={`h-full rounded-full ${target.isSVIP ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-primary'}`} 
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 mt-1 text-right font-mono">{target.status}</p>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnterChat?.();
                  }}
                  className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${target.isSVIP ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                >
                  {target.isSVIP ? <Send size={18} /> : <Handshake size={18} />}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="opacity-70 hover:opacity-100 transition-opacity">
          <div 
            onClick={() => setExpandedSection(expandedSection === 'likes' ? null : 'likes')}
            className="bg-slate-800/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 h-10 w-10 rounded-full flex items-center justify-center text-slate-400">
                <Bolt size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">仅点赞之交</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full w-[71%]" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">142/200</span>
                </div>
              </div>
            </div>
            <ChevronDown size={20} className={`text-slate-500 transition-transform ${expandedSection === 'likes' ? 'rotate-180' : ''}`} />
          </div>
          <AnimatePresence>
            {expandedSection === 'likes' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-2 mt-2"
              >
                {likeContacts.map(contact => (
                  <div 
                    key={contact.id} 
                    onClick={onEnterChat}
                    className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-xl border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    <img src={contact.avatar} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-200 truncate">{contact.name}</p>
                      <p className="text-[10px] text-slate-500">{contact.sub}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEnterChat?.(); }}
                      className="p-2 text-slate-500 hover:text-primary transition-colors"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="opacity-50 hover:opacity-100 transition-opacity">
          <div 
            onClick={() => setExpandedSection(expandedSection === 'history' ? null : 'history')}
            className="bg-slate-800/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer border border-transparent hover:border-red-900/50 group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-800/50 h-10 w-10 rounded-full flex items-center justify-center text-slate-500 group-hover:text-red-400 transition-colors">
                <History size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-400 group-hover:text-red-400 transition-colors">历史遗留连接 (已折叠 56 人)</h3>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">算法评估：无互动价值</p>
              </div>
            </div>
            <ChevronDown size={20} className={`text-slate-500 transition-transform ${expandedSection === 'history' ? 'rotate-180' : ''}`} />
          </div>
          <AnimatePresence>
            {expandedSection === 'history' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-2 mt-2"
              >
                {historyContacts.map(contact => (
                  <div 
                    key={contact.id} 
                    onClick={onEnterChat}
                    className="flex items-center gap-3 p-3 bg-slate-900/10 rounded-xl border border-white/5 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  >
                    <img src={contact.avatar} className="w-10 h-10 rounded-full object-cover grayscale" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-500 truncate">{contact.name}</p>
                      <p className="text-[10px] text-slate-600">{contact.sub}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEnterChat?.(); }}
                      className="p-2 text-slate-600 hover:text-danger transition-colors"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Batch Dialog */}
      <AnimatePresence>
        {showBatchDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => batchStatus !== 'processing' && setShowBatchDialog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden"
            >
              {batchStatus === 'idle' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Bolt size={32} className="text-amber-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white text-center">批量操作确认</h3>
                  <p className="text-sm text-slate-400 text-center leading-relaxed">
                    是否为以下高优维持对象点赞他们的所有动态以及群发夸赞话术给他们？
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setShowBatchDialog(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-400 font-bold text-sm hover:bg-slate-700 transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      onClick={startBatchProcess}
                      className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                      确认执行
                    </button>
                  </div>
                </div>
              )}

              {batchStatus === 'processing' && (
                <div className="py-8 flex flex-col items-center gap-4">
                  <Loader2 size={48} className="text-primary animate-spin" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">正在处理中</p>
                    <p className="text-xs text-slate-500 mt-1 font-mono">正在同步社交资产权重...</p>
                  </div>
                </div>
              )}

              {batchStatus === 'completed' && (
                <div className="py-8 flex flex-col items-center gap-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">处理完成</p>
                    <p className="text-xs text-slate-500 mt-1">已成功维护 2 位高优联系人关系</p>
                  </div>
                  <button 
                    onClick={() => setShowBatchDialog(false)}
                    className="mt-4 w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


