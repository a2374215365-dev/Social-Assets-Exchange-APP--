import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Camera, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Calendar,
  Image as ImageIcon,
  History,
  TrendingDown,
  Flower
} from "lucide-react";
import { Socket } from "socket.io-client";

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
  comments: Comment[];
}

interface PersonalFeedProps {
  user: any;
  onBack: () => void;
  socket: Socket | null;
}

export default function PersonalFeed({ user, onBack, socket }: PersonalFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [bgImage, setBgImage] = useState("https://picsum.photos/seed/cyber_bg/800/600");

  useEffect(() => {
    if (!socket) return;

    socket.emit("posts:fetch");
    const handleInit = (allPosts: Post[]) => {
      // Filter posts by the current user's name
      const userPosts = allPosts.filter(p => p.author.name === user.name);
      setPosts(userPosts);
    };

    const handleUpdate = (updatedPost: Post) => {
      if (updatedPost.author.name === user.name) {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
      }
    };

    socket.on("posts:init", handleInit);
    socket.on("post:updated", handleUpdate);
    socket.on("post:created", (newPost: Post) => {
      if (newPost.author.name === user.name) {
        setPosts(prev => [newPost, ...prev]);
      }
    });

    return () => {
      socket.off("posts:init", handleInit);
      socket.off("post:updated", handleUpdate);
      socket.off("post:created");
    };
  }, [socket, user.name]);

  const toggleInteraction = (postId: number, field: 'liked' | 'trendingDown' | 'flowered') => {
    if (socket) {
      socket.emit("post:interact", { postId, field });
    }
  };

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: '设交动态',
        text: post.content,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("您的浏览器不支持原生分享，已复制链接到剪贴板（模拟）");
    }
  };

  const stats = [
    { label: "动态", value: posts.length * 10 + 3500 },
    { label: "日志", value: 0 },
    { label: "相册", value: 36 },
    { label: "留言", value: 0 },
    { label: "访客", value: "2675" }
  ];

  const handleChangeBg = () => {
    const newSeed = Math.floor(Math.random() * 1000);
    setBgImage(`https://picsum.photos/seed/${newSeed}/800/600`);
  };

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-y-auto no-scrollbar">
      {/* Header / Cover */}
      <div className="relative h-64 w-full flex-shrink-0">
        <img 
          src={bgImage} 
          className="w-full h-full object-cover" 
          alt="Cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-dark" />
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-10"
        >
          <ArrowLeft size={20} />
        </button>

        <button 
          onClick={handleChangeBg}
          className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-10"
        >
          <Camera size={20} />
        </button>

        {/* User Info Overlay */}
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="relative">
            <img 
              src={user.avatar} 
              className="w-24 h-24 rounded-2xl border-4 border-background-dark object-cover shadow-2xl" 
              alt={user.name}
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold border-2 border-background-dark">
              {user.level || "LV.99"}
            </div>
          </div>
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {user.name}
              <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded border border-orange-500/30"></span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 italic">“这个人很懒，什么也不想说”</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mt-16 px-6 grid grid-cols-5 gap-2">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
            <span className="text-sm font-bold text-slate-200 mt-1">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="mt-8 px-4 space-y-6 pb-24">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            动态
            <span className="text-[10px] text-slate-500 font-normal">({posts.length})</span>
          </h3>
          <Calendar size={18} className="text-slate-500" />
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4 opacity-50">
            <History size={48} className="text-slate-700" />
            <p className="text-sm text-slate-500 italic">该用户尚未产生可量化的社交资产...</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/30 rounded-2xl p-4 border border-white/5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.author.avatar} className="w-8 h-8 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{post.author.name}</h4>
                    <p className="text-[10px] text-slate-500">{post.time}</p>
                  </div>
                </div>
                <button className="text-slate-500">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border-l-4 border-primary">
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="text-primary font-bold mr-2">删掉bot。:</span>
                  {post.content}
                </p>
              </div>

              {post.image && (
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img src={post.image} className="w-full h-48 object-cover" alt="" referrerPolicy="no-referrer" />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleInteraction(post.id, 'liked')}
                    className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
                  >
                    <ThumbsUp size={16} fill={post.liked ? "currentColor" : "none"} />
                    <span className="text-[10px]">{post.liked ? '已赞' : '赞'}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                    <MessageSquare size={16} />
                    <span className="text-[10px]">评论</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors"
                  >
                    <Share2 size={16} />
                    <span className="text-[10px]">转发</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleInteraction(post.id, 'trendingDown')}
                    className={`transition-colors ${post.trendingDown ? 'text-danger' : 'text-slate-600 hover:text-danger'}`}
                  >
                    <TrendingDown size={14} />
                  </button>
                  <button 
                    onClick={() => toggleInteraction(post.id, 'flowered')}
                    className={`transition-colors ${post.flowered ? 'text-pink-500' : 'text-slate-600 hover:text-pink-500'}`}
                  >
                    <Flower size={14} fill={post.flowered ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Satirical Interactions Summary */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <ThumbsUp size={12} className="text-primary" />
                  <p className="text-[9px] text-slate-500">
                    <span className="text-slate-300">想在星空睡觉zZ、彼端.、参肆什二？</span> 等 79 人赞了
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 size={12} className="text-slate-500" />
                  <p className="text-[9px] text-slate-500">
                    <span className="text-slate-300">上巳 (不学是吧)、@77、a啾啾β</span> 等 4 人转发了
                  </p>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>

      {/* Bottom Input Mimic */}
      <div className="fixed bottom-0 w-full max-w-md bg-slate-900/95 backdrop-blur-md border-t border-white/5 p-3 flex items-center gap-3">
        <img src="https://picsum.photos/seed/me/100/100" className="w-8 h-8 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
        <div className="flex-1 bg-black/40 rounded-full h-9 flex items-center px-4 border border-white/5">
          <span className="text-[11px] text-slate-500">说点什么吧...</span>
        </div>
      </div>
    </div>
  );
}
