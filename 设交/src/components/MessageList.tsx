import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Trash2, ShieldAlert, Users, MessageSquare, Activity, User, Info, MoreHorizontal, Flame, AlertCircle, RefreshCw } from "lucide-react";

interface MessageListProps {
  onViewProfile?: (user: any) => void;
  onShowCleanup?: () => void;
  onEnterChat?: () => void;
  onViewAssetButler?: () => void;
}

export default function MessageList({ onViewProfile, onShowCleanup, onEnterChat, onViewAssetButler }: MessageListProps) {
  const [showSubDialog, setShowSubDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      const startY = e.touches[0].pageY;
      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentY = moveEvent.touches[0].pageY;
        const diff = currentY - startY;
        if (diff > 0) {
          setPullDistance(Math.min(diff * 0.5, 80));
        }
      };
      const handleTouchEnd = () => {
        if (pullDistance > 50) {
          setIsRefreshing(true);
          setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
          }, 1500);
        } else {
          setPullDistance(0);
        }
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }
  };

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

  const handleMessageClick = (msg: any) => {
    if (msg.id === 1) {
      onViewAssetButler?.();
    } else if (msg.blurred) {
      setShowSubDialog(true);
    } else {
      onEnterChat?.();
    }
  };

  const messages = [
    {
      id: 1,
      title: "社交资产管家",
      subtitle: "警告！您有 3 个好友的火花即...",
      time: "刚刚",
      type: "system",
      avatar: "🤖",
      urgent: true,
      unread: true
    },
    {
      id: 2,
      title: "工作/学习打卡群",
      subtitle: "[有人@我] 收到请回复1",
      time: "2分钟前",
      type: "group",
      avatar: "👥",
      badge: "99+"
    },
    {
      id: 3,
      title: "十年老友",
      emoji: "🔥",
      subtitle: "[系统提示] 羁绊已点亮",
      time: "1小时前",
      type: "friend",
      avatar: "https://picsum.photos/seed/friend1/100/100",
      flame: true
    },
    {
      id: 4,
      title: "妈妈",
      emoji: "🚢",
      subtitle: "分享了一个链接：\"为什么你会失败...\"",
      time: "4小时前",
      type: "family",
      avatar: "妈"
    },
    {
      id: 5,
      title: "身体优化单元",
      emoji: "🐉",
      subtitle: "检测到肌肉萎缩。羞耻等级: 85%",
      time: "昨天",
      type: "health",
      avatar: "💪"
    },
    {
      id: 6,
      title: "潜在配偶 #492",
      subtitle: "订阅已过期。消息已模糊处理。",
      time: "2天前",
      type: "dating",
      avatar: "https://picsum.photos/seed/mate492/100/100",
      blurred: true
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <header className="p-6 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-danger flex items-center gap-2">
          消息 <span className="text-slate-500 text-lg font-normal">(99+)</span>
        </h1>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onShowCleanup?.();
          }}
          className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full text-xs text-slate-300 transition-colors"
        >
          <Trash2 size={14} />
          清理社交垃圾
        </button>
      </header>

      <div className="px-6 py-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">紧急社交债务</p>
      </div>

      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        className="flex-1 overflow-y-auto no-scrollbar relative"
      >
        {/* Pull to refresh indicator */}
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none z-40"
          style={{ height: pullDistance, opacity: pullDistance / 50 }}
        >
          <RefreshCw size={20} className={`text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>

        <div style={{ transform: `translateY(${pullDistance}px)` }} className="transition-transform duration-200">
          {messages.map((msg) => (
          <motion.div
            key={msg.id}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
            onClick={() => handleMessageClick(msg)}
            className={`flex items-center gap-4 px-6 py-4 border-b border-white/5 relative cursor-pointer ${msg.urgent ? 'border-l-4 border-l-danger' : ''}`}
          >
            <div 
              className="relative shrink-0 cursor-pointer"
              onClick={(e) => {
                if (typeof msg.avatar === 'string' && msg.avatar.startsWith('http')) {
                  e.stopPropagation();
                  handleAvatarClick(msg.title, msg.avatar);
                }
              }}
            >
              {typeof msg.avatar === 'string' && msg.avatar.startsWith('http') ? (
                <img 
                  src={msg.avatar} 
                  alt={msg.title} 
                  className={`w-14 h-14 rounded-full object-cover border border-white/10 ${msg.blurred ? 'blur-sm grayscale' : ''}`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-slate-800 border border-white/10`}>
                  {msg.avatar}
                </div>
              )}
              {msg.flame && (
                <div className="absolute -bottom-1 -right-1 bg-background-dark rounded-full p-0.5">
                  <div className="bg-orange-500 rounded-full p-1">
                    <Flame size={10} className="text-white fill-current" />
                  </div>
                </div>
              )}
              {msg.unread && !msg.badge && (
                <div className="absolute top-0 -right-1 w-3 h-3 bg-danger rounded-full border-2 border-background-dark" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-base font-bold text-white truncate">{msg.title}</h3>
                  {msg.emoji && (
                    <span className="text-sm bg-slate-800/50 px-1.5 py-0.5 rounded border border-white/5">{msg.emoji}</span>
                  )}
                </div>
                <span className={`text-[10px] font-mono ${msg.urgent ? 'text-danger' : 'text-slate-500'}`}>
                  {msg.time}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {msg.urgent && <AlertCircle size={14} className="text-danger shrink-0" />}
                <p className={`text-sm truncate ${msg.urgent ? 'text-danger font-bold' : 'text-slate-400'}`}>
                  {msg.subtitle}
                </p>
              </div>
            </div>

            {msg.badge && (
              <div className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {msg.badge}
              </div>
            )}
          </motion.div>
        ))}

        <div className="p-12 flex flex-col items-center justify-center text-slate-600 gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center">
            <Activity size={24} className="opacity-20" />
          </div>
          <p className="text-xs font-mono uppercase tracking-widest">有效连接已耗尽</p>
        </div>
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
                  <User size={40} className="text-primary" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">解锁深度连接</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    您的 <span className="text-primary font-bold">设交Pro</span> 订阅已过期。潜在配偶及高价值人脉的消息已被算法自动模糊处理。
                  </p>
                  <p className="text-[10px] text-slate-500 italic pt-2">
                    “不要让贫穷限制了您的社交资产增值潜力。”
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
                    放弃这段关系
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
