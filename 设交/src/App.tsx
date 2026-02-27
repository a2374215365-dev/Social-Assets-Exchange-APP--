/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Users, Rss, User, Plus } from "lucide-react";
import { io, Socket } from "socket.io-client";
import SplashScreen from "./components/SplashScreen";
import MessageList from "./components/MessageList";
import ContactList from "./components/ContactList";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import ChatRoom from "./components/ChatRoom";
import CleanupDialog from "./components/CleanupDialog";
import CreatePost from "./components/CreatePost";
import PersonalFeed from "./components/PersonalFeed";
import AssetButler from "./components/AssetButler";
import { MOCK_POSTS } from "./data/mockPosts";

type Tab = "messages" | "contacts" | "feed" | "me";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("messages");
  const [inChat, setInChat] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [viewingPersonalFeed, setViewingPersonalFeed] = useState<any>(null);
  const [viewingAssetButler, setViewingAssetButler] = useState(false);
  const [showCleanup, setShowCleanup] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [posts, setPosts] = useState<any[]>(MOCK_POSTS);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("posts:init", (initialPosts: any[]) => {
      setPosts(initialPosts);
    });

    newSocket.on("post:created", (newPost: any) => {
      setPosts(prev => {
        if (prev.find(p => p.id === newPost.id)) return prev;
        return [newPost, ...prev];
      });
    });

    newSocket.on("comment:created", ({ postId, comment }: { postId: number, comment: any }) => {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const comments = post.comments || [];
          if (comments.find((c: any) => c.id === comment.id)) return post;
          return { ...post, comments: [...comments, comment] };
        }
        return post;
      }));
    });

    newSocket.on("post:updated", (updatedPost: any) => {
      setPosts(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Trigger cleanup dialog after some time for "algorithmic suggestion" feel
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowCleanup(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return <SplashScreen onComplete={() => setLoading(false)} />;
  }

  const handleCreatePost = (post: any) => {
    const newPost = {
      ...post,
      id: Date.now(),
      time: "刚刚",
      comments: [],
      liked: false,
      trendingDown: false,
      flowered: false
    };

    // Local update for immediate feedback and frontend-only demo
    setPosts(prev => [newPost, ...prev]);

    if (socket && socket.connected) {
      socket.emit("post:create", post);
    }
    
    setIsCreatingPost(false);
    setActiveTab("feed");
  };

  const handleBack = () => {
    if (isCreatingPost) setIsCreatingPost(false);
    else if (viewingPersonalFeed) setViewingPersonalFeed(null);
    else if (viewingAssetButler) setViewingAssetButler(false);
    else if (inChat) setInChat(false);
    else if (viewingProfile) setViewingProfile(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].pageX;
    const startY = e.touches[0].pageY;
    
    // Only trigger if starting from the left edge (first 30px)
    if (startX > 30) return;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentX = moveEvent.touches[0].pageX;
      const currentY = moveEvent.touches[0].pageY;
      const diffX = currentX - startX;
      const diffY = Math.abs(currentY - startY);

      // If horizontal movement is significant and vertical is minimal
      if (diffX > 50 && diffY < 30) {
        handleBack();
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const renderContent = () => {
    if (isCreatingPost) {
      return <CreatePost onBack={() => setIsCreatingPost(false)} onPost={handleCreatePost} />;
    }

    if (viewingPersonalFeed) {
      return (
        <PersonalFeed 
          user={viewingPersonalFeed} 
          onBack={() => setViewingPersonalFeed(null)} 
          socket={socket}
        />
      );
    }

    if (viewingAssetButler) {
      return (
        <AssetButler 
          onBack={() => setViewingAssetButler(false)} 
          onShowCleanup={() => setShowCleanup(true)}
          onEnterChat={() => {
            setViewingAssetButler(false);
            setInChat(true);
          }}
        />
      );
    }

    if (inChat) {
      return (
        <ChatRoom 
          onBack={() => setInChat(false)} 
          onViewProfile={(user: any) => setViewingProfile(user)}
        />
      );
    }

    if (viewingProfile) {
      return (
        <Profile 
          user={viewingProfile.isMe ? undefined : viewingProfile} 
          onBack={() => setViewingProfile(null)} 
          onSendMessage={() => {
            setViewingProfile(null);
            setInChat(true);
          }}
          onViewPersonalFeed={(user: any) => {
            setViewingProfile(null);
            setViewingPersonalFeed(user);
          }}
        />
      );
    }

    switch (activeTab) {
      case "messages":
        return (
          <div className="h-full">
            <MessageList 
              onViewProfile={(user: any) => setViewingProfile(user)} 
              onShowCleanup={() => setShowCleanup(true)}
              onEnterChat={() => setInChat(true)}
              onViewAssetButler={() => setViewingAssetButler(true)}
            />
          </div>
        );
      case "contacts":
        return (
          <ContactList 
            onViewProfile={(user: any) => setViewingProfile(user)} 
            onEnterChat={() => setInChat(true)}
            onShowCleanup={() => setShowCleanup(true)}
          />
        );
      case "feed":
        return (
          <Feed 
            onViewProfile={(user: any) => setViewingProfile(user)} 
            onViewPersonalFeed={(user: any) => setViewingPersonalFeed(user)}
            onCreatePost={() => setIsCreatingPost(true)}
            posts={posts}
            setPosts={setPosts}
            socket={socket} 
          />
        );
      case "me":
        return (
          <Profile 
            onViewPersonalFeed={() => setViewingPersonalFeed({ name: "芋头", avatar: "https://picsum.photos/seed/tram/200/200", level: "LV.99", isMe: true })} 
          />
        );
      default:
        return <MessageList onViewProfile={(user: any) => setViewingProfile(user)} />;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-slate-100 dark:bg-black">
      <div 
        onTouchStart={handleTouchStart}
        className="w-full max-w-md h-screen bg-white dark:bg-background-dark flex flex-col relative overflow-hidden shadow-2xl"
      >
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={inChat ? 'chat' : viewingProfile ? 'view-profile' : viewingAssetButler ? 'butler' : activeTab}
              initial={{ opacity: 0, x: (inChat || viewingProfile || viewingAssetButler) ? 20 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: (inChat || viewingProfile || viewingAssetButler) ? -20 : 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {!inChat && !viewingProfile && !viewingPersonalFeed && !viewingAssetButler && (
          <nav className="bg-slate-900/95 backdrop-blur-lg border-t border-white/5 z-50 pb-8 pt-3 px-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab("messages")}
                className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'messages' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <div className="relative">
                  <MessageSquare size={24} fill={activeTab === 'messages' ? "currentColor" : "none"} />
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-danger rounded-full border-2 border-slate-900" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide">消息</span>
              </button>

              <button 
                onClick={() => setActiveTab("contacts")}
                className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'contacts' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Users size={24} fill={activeTab === 'contacts' ? "currentColor" : "none"} />
                <span className="text-[10px] font-bold uppercase tracking-wide">联系人</span>
              </button>

              <button 
                onClick={() => setIsCreatingPost(true)}
                className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform active:scale-95 -mt-8 border-4 border-slate-900"
              >
                <Plus size={24} />
              </button>

              <button 
                onClick={() => setActiveTab("feed")}
                className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'feed' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Rss size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wide">动态</span>
              </button>

              <button 
                onClick={() => setActiveTab("me")}
                className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'me' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <div className="relative flex flex-col items-center">
                  <User size={24} fill={activeTab === 'me' ? "currentColor" : "none"} />
                  {activeTab === 'me' && <div className="h-1 w-1 bg-primary rounded-full mt-0.5" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide">我</span>
              </button>
            </div>
          </nav>
        )}

        {/* Dialogs */}
        <CleanupDialog isOpen={showCleanup} onClose={() => setShowCleanup(false)} />
      </div>
    </div>
  );
}
