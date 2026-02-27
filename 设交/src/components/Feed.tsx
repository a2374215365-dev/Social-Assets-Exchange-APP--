import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Timer, ArrowLeft, LineChart, Edit, MoreHorizontal, Verified, History, ThumbsUp, TrendingDown, Flower, Lock, CreditCard, X, MessageCircle, Smile, Send, RefreshCw } from "lucide-react";
import { Socket } from "socket.io-client";
import { APPLE_EMOJIS } from "../constants";
import { MOCK_POSTS } from "../data/mockPosts";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
}

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    level: string;
    verified?: boolean;
    sub: string;
  };
  time: string;
  timer?: string;
  content: string;
  image?: string;
  productivity?: string;
  rating?: string;
  liked: boolean;
  trendingDown: boolean;
  flowered: boolean;
  endorsements?: {
    count: number;
    names: string[];
  };
  comments: Comment[];
}

interface FeedProps {
  onViewProfile?: (user: any) => void;
  onViewPersonalFeed?: (user: any) => void;
  onCreatePost?: () => void;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  socket: Socket | null;
}

export default function Feed({ onViewProfile, onViewPersonalFeed, onCreatePost, posts, setPosts, socket }: FeedProps) {
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(() => {
    if (socket) {
      socket.emit("posts:fetch");
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleInit = (initialPosts: Post[]) => {
      setIsRefreshing(false);
      setPullDistance(0);
    };

    socket.on("posts:init", handleInit);

    fetchPosts();

    return () => {
      socket.off("posts:init", handleInit);
    };
  }, [socket, fetchPosts]);

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
          fetchPosts();
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

  const recommendations = [
    { id: 1, name: "科技新贵", sub: "净资产 > 你", avatar: "https://picsum.photos/seed/rich/100/100", action: "建立连接" },
    { id: 2, name: "网红甲", sub: "粉丝: 10w", avatar: "https://picsum.photos/seed/influencer/100/100", action: "关注", primary: true },
    { id: 3, name: "AI助手", sub: "全天在线", avatar: "🤖", action: "安装" }
  ];

  const handlePostAvatarClick = (post: Post) => {
    if (onViewPersonalFeed) {
      onViewPersonalFeed({
        name: post.author.name,
        avatar: post.author.avatar,
        level: post.author.level,
        sub: post.author.sub
      });
    }
  };

  const handleRecommendationAvatarClick = (name: string, avatar: string) => {
    if (onViewProfile) {
      onViewProfile({
        name,
        avatar,
        level: "LVL " + (Math.floor(Math.random() * 99) + 1),
        bio: "这是一个量化社交资产的样本个人简介。"
      });
    }
  };

  const toggleInteraction = (postId: number, field: 'liked' | 'trendingDown' | 'flowered') => {
    // Local update for immediate feedback and frontend-only demo
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, [field]: !post[field] };
      }
      return post;
    }));

    if (socket && socket.connected) {
      socket.emit("post:interact", { postId, field });
    }
  };

  const handleSendComment = (postId: number) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: "芋头",
      avatar: "https://picsum.photos/seed/tram/200/200",
      content,
      time: "刚刚"
    };

    // Local update for immediate feedback and frontend-only demo
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const comments = post.comments || [];
        return { ...post, comments: [...comments, newComment] };
      }
      return post;
    }));

    if (socket && socket.connected) {
      socket.emit("comment:create", {
        postId,
        comment: newComment
      });
    }

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    setShowEmojiPicker(null);
  };

  const handleEmojiSelect = (postId: number, emoji: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: (prev[postId] || "") + emoji
    }));
  };

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <header className="fixed top-0 w-full max-w-md z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5">
        <div className="h-14 flex items-center justify-between px-4">
          <button className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold font-display">社交资产动态</h1>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={onCreatePost}
              className="p-2 -mr-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <Edit size={24} />
            </button>
          </div>
        </div>
      </header>

      <main 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        className="pt-14 pb-20 no-scrollbar overflow-y-auto relative"
      >
        {/* Pull to refresh indicator */}
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none z-40"
          style={{ height: pullDistance, opacity: pullDistance / 50 }}
        >
          <RefreshCw size={20} className={`text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>

        <div style={{ transform: `translateY(${pullDistance}px)` }} className="transition-transform duration-200">
          {posts.map((post) => (
            <article key={post.id} className="bg-slate-900/50 mb-3 pb-4 border-b border-white/5 shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => handlePostAvatarClick(post)}
                  >
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[8px] px-1 rounded-sm shadow-sm border border-background-dark">{post.author.level}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-orange-500">{post.author.name}</span>
                      {post.author.verified && <Verified size={14} className="text-blue-500" />}
                    </div>
                    <span className="text-[10px] text-slate-500">{post.author.sub} • {post.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.timer && (
                    <div className="flex items-center gap-1 text-danger text-[10px] font-mono font-bold bg-danger/10 px-2 py-1 rounded-full border border-danger/20">
                      <Timer size={10} />
                      {post.timer}
                    </div>
                  )}
                  <button className="text-slate-500 hover:bg-white/5 rounded-full p-1">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
              <div className="px-4 mb-3">
                <p className="text-sm leading-relaxed text-slate-200">
                  {post.content}
                </p>
              </div>
              {post.image && (
                <div className="w-full h-80 bg-slate-800 relative overflow-hidden group">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {post.productivity && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 border border-white/10">
                      <History size={12} />
                      <span>生产力: {post.productivity}</span>
                    </div>
                  )}
                  {post.rating && (
                    <div className="absolute top-3 left-3 bg-emerald-500/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded font-bold">
                      资产评级: {post.rating}
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between px-6 py-3 mt-1">
                <button 
                  onClick={() => toggleInteraction(post.id, 'liked')}
                  className={`flex items-center gap-1.5 transition-all duration-300 group ${post.liked ? 'text-primary scale-110' : 'text-slate-400 hover:text-primary'}`}
                >
                  <ThumbsUp size={18} fill={post.liked ? "currentColor" : "none"} />
                  <span className="text-[10px] font-medium">{post.liked ? '已背书' : '大佬辛苦了！'}</span>
                </button>
                <button 
                  onClick={() => toggleInteraction(post.id, 'trendingDown')}
                  className={`flex items-center gap-1.5 transition-all duration-300 group ${post.trendingDown ? 'text-danger scale-110' : 'text-slate-400 hover:text-danger'}`}
                >
                  <TrendingDown size={18} />
                  <span className="text-[10px] font-medium">{post.trendingDown ? '已降权' : '太卷了吧！'}</span>
                </button>
                <button 
                  onClick={() => toggleInteraction(post.id, 'flowered')}
                  className={`flex items-center gap-1.5 transition-all duration-300 group ${post.flowered ? 'text-green-500 scale-110' : 'text-slate-400 hover:text-green-500'}`}
                >
                  <Flower size={18} fill={post.flowered ? "currentColor" : "none"} />
                  <span className="text-[10px] font-medium">{post.flowered ? '已赠送' : '[送上一朵虚拟鲜花]'}</span>
                </button>
              </div>
              {post.comments && post.comments.length > 0 && (
                <div className="px-4 py-2 space-y-2 border-t border-white/5 bg-black/20">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <img src={comment.avatar} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-300">{comment.author}</span>
                          <span className="text-[8px] text-slate-600">{comment.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="px-4 py-3 bg-white/5 border-t border-white/5">
                {post.endorsements && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-primary/20 text-primary p-1 rounded-full">
                      <ThumbsUp size={12} fill="currentColor" />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {post.endorsements.names.map((name, i) => (
                        <span key={i}><span className="font-bold text-slate-200">{name}</span>{i < post.endorsements!.names.length - 1 ? ', ' : ''}</span>
                      ))} 和其他 {post.endorsements.count} 人背书了该资产。
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <img src="https://picsum.photos/seed/me/100/100" className="w-8 h-8 rounded-lg object-cover border border-white/10" referrerPolicy="no-referrer" />
                    <div className="flex-1 bg-black/40 rounded-lg h-9 flex items-center px-3 border border-white/5 relative">
                      <input 
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                        placeholder="输入标准化赞美..."
                        className="flex-1 bg-transparent text-[10px] text-slate-200 focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setShowEmojiPicker(showEmojiPicker === post.id ? null : post.id)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          <Smile size={16} />
                        </button>
                        <button 
                          onClick={() => handleSendComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                          className="text-primary disabled:text-slate-700"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showEmojiPicker === post.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 120, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-y-auto no-scrollbar grid grid-cols-8 gap-1 p-2 bg-slate-800 rounded-lg border border-white/10"
                      >
                        {APPLE_EMOJIS.map((emoji, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleEmojiSelect(post.id, emoji)}
                            className="text-lg hover:bg-white/5 p-1 rounded transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </article>
          ))}

          {/* Locked Post */}
          <article className="bg-slate-900/50 mb-3 relative overflow-hidden border-b border-white/5 shadow-sm group">
            <div className="opacity-40 blur-[2px] pointer-events-none select-none grayscale">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 border-2 border-yellow-500" />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-purple-400 italic">葬噯丶冷尐</span>
                    <span className="text-[10px] text-slate-500">2014-05-12 • 诺基亚 N97</span>
                  </div>
                </div>
              </div>
              <div className="px-4 mb-2">
                <p className="text-sm leading-relaxed italic text-purple-200">
                  时间会让人产生不同的理解... 当初的我们去哪了？ 🍃💔 雨落在心里...
                </p>
              </div>
              <div className="w-full h-64 bg-slate-800 grid grid-cols-2 gap-0.5">
                <div className="bg-slate-700" />
                <div className="bg-slate-600" />
              </div>
            </div>
            
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center border-l-4 border-danger">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-danger/20 max-w-sm w-full"
              >
                <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Lock size={32} className="text-danger" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">🛑 访问受限</h3>
                <p className="text-sm text-slate-400 mb-4">
                  该用户已开启 <span className="font-mono bg-slate-800 px-1 rounded text-xs">【仅半年可见】</span>。
                </p>
                <p className="text-[10px] text-slate-500 border-t border-white/5 pt-3 italic leading-relaxed">
                  “过去的自己已被平台协议隐藏，以优化当前的社会市场价值。”
                </p>
                <button className="mt-5 w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                  <CreditCard size={16} />
                  解锁 ¥28.00/月
                </button>
              </motion.div>
            </div>
          </article>

          {/* Recommendations */}
          <article className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">推荐人脉</h4>
              <span className="text-[10px] text-primary font-bold">查看全部</span>
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
              {recommendations.map((rec) => (
                <div key={rec.id} className="min-w-[140px] bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col items-center text-center relative">
                  <button className="absolute top-1 right-1 text-slate-600 hover:text-slate-400">
                    <X size={14} />
                  </button>
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleRecommendationAvatarClick(rec.name, rec.avatar.startsWith('http') ? rec.avatar : "https://picsum.photos/seed/ai/100/100")}
                  >
                    {rec.avatar.startsWith('http') ? (
                      <img src={rec.avatar} className="w-12 h-12 rounded-full mb-2 object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-12 h-12 rounded-full mb-2 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">{rec.avatar}</div>
                    )}
                  </div>
                  <h5 className="text-xs font-bold truncate w-full text-white">{rec.name}</h5>
                  <p className="text-[9px] text-slate-500 mb-2">{rec.sub}</p>
                  <button 
                    onClick={() => handleRecommendationAvatarClick(rec.name, rec.avatar.startsWith('http') ? rec.avatar : "https://picsum.photos/seed/ai/100/100")}
                    className={`text-[10px] font-bold py-1.5 px-3 rounded-full w-full transition-colors ${rec.primary ? 'bg-primary text-white' : 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white'}`}
                  >
                    {rec.action}
                  </button>
                </div>
              ))}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
