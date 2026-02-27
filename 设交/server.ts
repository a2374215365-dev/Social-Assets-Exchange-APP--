import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // In-memory store for simulation
  let posts = [
    {
      id: 1,
      author: {
        name: "职场牛马",
        avatar: "https://picsum.photos/seed/ox/100/100",
        level: "LV.99",
        verified: true,
        sub: "高性能耗材"
      },
      time: "1分钟前",
      timer: "02:14",
      content: "又是一个加班的周末，打卡。只要卷不死，就往死里卷。效率至上。💼📈#奋斗 #职场 #成长思维",
      image: "https://picsum.photos/seed/shanghai/800/600",
      productivity: "+15分",
      liked: false,
      trendingDown: false,
      flowered: false,
      endorsements: {
        count: 42,
        names: ["HR经理", "组长"]
      },
      comments: []
    },
    {
      id: 2,
      author: {
        name: "量化生活家",
        avatar: "https://picsum.photos/seed/quant/100/100",
        level: "LV.42",
        sub: "自律即自由"
      },
      time: "15分钟前",
      content: "今日深度工作 4 小时，冥想 20 分钟。社交资产价值稳步提升中。📊🧘‍♂️ #量化自我 #效率工具 #个人成长",
      image: "https://picsum.photos/seed/desk/800/600",
      rating: "A+",
      liked: false,
      trendingDown: false,
      flowered: false,
      comments: []
    },
    {
      id: 3,
      author: {
        name: "数字游民",
        avatar: "https://picsum.photos/seed/nomad/100/100",
        level: "LV.67",
        sub: "在云端办公"
      },
      time: "1小时前",
      content: "清迈的咖啡馆，网速 200Mbps，社交资产溢价 15%。这就是我想要的生活。💻🌴 #数字游民 #远程办公 #自由职业",
      image: "https://picsum.photos/seed/cafe/800/600",
      liked: false,
      trendingDown: false,
      flowered: false,
      comments: []
    },
    {
      id: 4,
      author: {
        name: "AI 创业者",
        avatar: "https://picsum.photos/seed/ai_founder/100/100",
        level: "LV.88",
        sub: "All in AI"
      },
      time: "3小时前",
      content: "新模型测试结果惊人，推理能力提升 40%。社交资产正在向算力持有者集中。🤖🚀 #ArtificialIntelligence #创业 #未来已来",
      image: "https://picsum.photos/seed/server/800/600",
      liked: false,
      trendingDown: false,
      flowered: false,
      comments: []
    },
    {
      id: 5,
      author: {
        name: "赛博艺术家",
        avatar: "https://picsum.photos/seed/art/100/100",
        level: "LV.75",
        sub: "数字美学"
      },
      time: "5小时前",
      content: "在虚拟与现实的边界寻找美。每一像素都是资产。🎨✨ #赛博朋克 #数字艺术 #美学溢价",
      image: "https://picsum.photos/seed/cyber/800/600",
      liked: false,
      trendingDown: false,
      flowered: false,
      comments: []
    },
    {
      id: 6,
      author: {
        name: "情感分析师",
        avatar: "https://picsum.photos/seed/emotion/100/100",
        level: "LV.50",
        sub: "情绪对冲专家"
      },
      time: "6小时前",
      content: "检测到市场情绪波动，建议立即开启情绪平衡器。真诚是社交资产最大的敌人。📉🛡️ #情绪管理 #资产保值 #理性至上",
      image: "https://picsum.photos/seed/chart/800/600",
      liked: false,
      trendingDown: false,
      flowered: false,
      comments: []
    },
    {
      id: 7,
      author: {
        name: "社交资产经理",
        avatar: "https://picsum.photos/seed/manager/100/100",
        level: "LV.92",
        sub: "杠杆操作员"
      },
      time: "8小时前",
      content: "今日动态曝光率已通过 10x 杠杆拉满。社交币的投入产出比（ROI）达到历史新高。💰🚀 #社交金融 #资产增值 #财富密码",
      image: "https://picsum.photos/seed/money/800/600",
      liked: false,
      trendingDown: false,
      flowered: false,
      comments: []
    },
    {
      id: 8,
      author: {
        name: "算法牧羊人",
        avatar: "https://picsum.photos/seed/shepherd/100/100",
        level: "LV.85",
        sub: "合规性布道者"
      },
      time: "10小时前",
      content: "顺从算法，就是顺从未来。合规性检查不仅是保护，更是恩赐。🐑🤖 #算法崇拜 #数字合规 #系统之美",
      image: "https://picsum.photos/seed/robot/800/600",
      liked: false,
      trendingDown: false,
      flowered: false,
      comments: []
    },
    {
      id: 9,
      author: {
        name: "效率狂人",
        avatar: "https://picsum.photos/seed/speed/100/100",
        level: "LV.60",
        sub: "时间管理大师"
      },
      time: "12小时前",
      content: "睡觉是社交资产的负债。我已成功将睡眠缩短至 3 小时，生产力提升 200%。⚡️📈 #效率至上 #时间管理 #卷王之王",
      image: "https://picsum.photos/seed/clock/800/600",
      liked: false,
      trendingDown: false,
      flowered: false,
      comments: []
    },
    {
      id: 10,
      author: {
        name: "虚拟名媛",
        avatar: "https://picsum.photos/seed/lady/100/100",
        level: "LV.99",
        sub: "社交溢价专家"
      },
      time: "1天前",
      content: "今日下午茶：50% 真实，50% 算法增强。社交资产溢价 300%。☕️💎 #名媛生活 #社交溢价 #数字滤镜",
      image: "https://picsum.photos/seed/tea/800/600",
      liked: false,
      trendingDown: false,
      flowered: false,
      comments: []
    }
  ];

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send initial posts
    socket.emit("posts:init", posts);

    socket.on("posts:fetch", () => {
      socket.emit("posts:init", posts);
    });

    socket.on("post:create", (newPost) => {
      const postWithId = { 
        ...newPost, 
        id: Date.now(), 
        time: "刚刚",
        comments: [],
        liked: false,
        trendingDown: false,
        flowered: false
      };
      posts = [postWithId, ...posts];
      io.emit("post:created", postWithId);
    });

    socket.on("comment:create", ({ postId, comment }) => {
      const post = posts.find(p => p.id === postId);
      if (post) {
        const newComment = { ...comment, id: Date.now(), time: "刚刚" };
        post.comments = [...(post.comments || []), newComment];
        io.emit("comment:created", { postId, comment: newComment });
      }
    });

    socket.on("post:interact", ({ postId, field }) => {
      const post = posts.find(p => p.id === postId);
      if (post) {
        (post as any)[field] = !(post as any)[field];
        io.emit("post:updated", post);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
