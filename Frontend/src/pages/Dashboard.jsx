import { useState } from "react";
import "../css/Dashboard.css";
import Navbar from "../pages/Navbar.jsx";
/* ── Mock Data ── */
const STATS = [
  { id: "views",     label: "Total Views",     value: "2.4M",  change: "+18.2%", up: true,  icon: "👁" },
  { id: "reels",     label: "Reels Posted",    value: "384",   change: "+6.4%",  up: true,  icon: "🎬" },
  { id: "followers", label: "Followers",       value: "52.1K", change: "+11.7%", up: true,  icon: "👥" },
  { id: "revenue",   label: "Est. Revenue",    value: "$3,820", change: "-2.1%", up: false, icon: "💰" },
];

const TRENDING = [
  { id: 1, business: "ZenBrew Coffee",    category: "Food & Drink", views: "841K", thumbnail: "https://picsum.photos/seed/coffee1/400/600",   avatar: "https://i.pravatar.cc/40?img=1",  verified: true  },
  { id: 2, business: "FitForge Gym",      category: "Fitness",      views: "620K", thumbnail: "https://picsum.photos/seed/gym22/400/600",     avatar: "https://i.pravatar.cc/40?img=2",  verified: true  },
  { id: 3, business: "Nova Skin Studio",  category: "Beauty",       views: "512K", thumbnail: "https://picsum.photos/seed/beauty3/400/600",   avatar: "https://i.pravatar.cc/40?img=3",  verified: false },
  { id: 4, business: "TechHub Repairs",   category: "Technology",   views: "398K", thumbnail: "https://picsum.photos/seed/tech44/400/600",    avatar: "https://i.pravatar.cc/40?img=4",  verified: false },
  { id: 5, business: "Bloom Florist",     category: "Lifestyle",    views: "287K", thumbnail: "https://picsum.photos/seed/flower5/400/600",   avatar: "https://i.pravatar.cc/40?img=5",  verified: true  },
];

const RECENT_REELS = [
  { id: 1, title: "Morning Brew Ritual",     business: "ZenBrew Coffee",   views: "124K", likes: "8.2K", time: "2h ago",   thumbnail: "https://picsum.photos/seed/reel1/300/500",  hot: true  },
  { id: 2, title: "5-Min Full Body Burn",    business: "FitForge Gym",     views: "98K",  likes: "6.1K", time: "5h ago",   thumbnail: "https://picsum.photos/seed/reel2/300/500",  hot: true  },
  { id: 3, title: "Summer Glow Routine",     business: "Nova Skin Studio", views: "76K",  likes: "4.8K", time: "8h ago",   thumbnail: "https://picsum.photos/seed/reel3/300/500",  hot: false },
  { id: 4, title: "Screen Repair in 60s",    business: "TechHub Repairs",  views: "54K",  likes: "3.2K", time: "1d ago",   thumbnail: "https://picsum.photos/seed/reel4/300/500",  hot: false },
  { id: 5, title: "Wildflower Arrangement", business: "Bloom Florist",    views: "41K",  likes: "2.9K", time: "1d ago",   thumbnail: "https://picsum.photos/seed/reel5/300/500",  hot: false },
  { id: 6, title: "Espresso Art Tutorial",   business: "ZenBrew Coffee",   views: "38K",  likes: "2.4K", time: "2d ago",   thumbnail: "https://picsum.photos/seed/reel6/300/500",  hot: false },
];

const CATEGORIES = ["All", "Food & Drink", "Fitness", "Beauty", "Technology", "Lifestyle", "Fashion", "Travel"];

/* ── Sub-components ── */

function StatCard({ stat, index }) {
  return (
    <div className="db-stat" style={{ "--i": index }}>
      <div className="db-stat__top">
        <span className="db-stat__icon">{stat.icon}</span>
        <span className={`db-stat__change ${stat.up ? "db-stat__change--up" : "db-stat__change--down"}`}>
          {stat.up ? "↑" : "↓"} {stat.change}
        </span>
      </div>
      <div className="db-stat__value">{stat.value}</div>
      <div className="db-stat__label">{stat.label}</div>
      <div className="db-stat__bar">
        <div className="db-stat__bar-fill" style={{ "--w": stat.up ? "72%" : "38%" }} />
      </div>
    </div>
  );
}

function TrendingCard({ item, index }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="db-trend" style={{ "--i": index }}>
      <div className="db-trend__thumb-wrap">
        <img src={item.thumbnail} alt={item.business} className="db-trend__thumb" loading="lazy" />
        <div className="db-trend__overlay">
          <span className="db-trend__views">👁 {item.views}</span>
          <button className={`db-trend__like ${liked ? "db-trend__like--active" : ""}`} onClick={() => setLiked(!liked)}>
            {liked ? "❤️" : "🤍"}
          </button>
        </div>
        <span className="db-trend__cat">{item.category}</span>
      </div>
      <div className="db-trend__info">
        <img src={item.avatar} alt="" className="db-trend__avatar" />
        <div className="db-trend__meta">
          <span className="db-trend__name">
            {item.business}
            {item.verified && <span className="db-trend__verified">✓</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReelRow({ reel, index }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="db-reel" style={{ "--i": index }}>
      <div className="db-reel__thumb-wrap">
        <img src={reel.thumbnail} alt={reel.title} className="db-reel__thumb" loading="lazy" />
        {reel.hot && <span className="db-reel__hot">🔥</span>}
        <div className="db-reel__play">▶</div>
      </div>
      <div className="db-reel__body">
        <p className="db-reel__title">{reel.title}</p>
        <p className="db-reel__biz">{reel.business}</p>
        <div className="db-reel__stats">
          <span>👁 {reel.views}</span>
          <span>❤️ {reel.likes}</span>
          <span className="db-reel__time">{reel.time}</span>
        </div>
      </div>
      <button className={`db-reel__save ${saved ? "db-reel__save--active" : ""}`} onClick={() => setSaved(!saved)}>
        {saved ? "🔖" : "🏷"}
      </button>
    </div>
  );
}

/* ── Dashboard ── */
export default function Dashboard() {
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery]       = useState("");

  const filteredReels = RECENT_REELS.filter(r =>
    (activeCategory === "All" || TRENDING.find(t => t.business === r.business)?.category === activeCategory) &&
    (searchQuery === "" || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.business.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (<div>
    <Navbar/>
 
    <div className="db">
      {/* ── Header ── */}
      <header className="db__header">
        <div className="db__header-left">
          <h1 className="db__title">Reelify</h1>
          <p className="db__subtitle">Boost your bussiness</p>
        </div>
        <div className="db__header-right">
          <div className="db__search">
            <span className="db__search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search reels, businesses..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="db__search-input"
            />
          </div>
          <button className="db__upload-btn">
            <span>+</span> Upload Reel
          </button>
        </div>
      </header>

      {/* ── Stats Row ── */}
      {/* <section className="db__stats">
        {STATS.map((s, i) => <StatCard key={s.id} stat={s} index={i} />)}
      </section> */}

      {/* ── Trending Businesses ── */}
      <section className="db__section">
        <div className="db__section-head">
          <h2 className="db__section-title">🔥 Trending Businesses</h2>
          <a href="#" className="db__see-all">See all →</a>
        </div>
        <div className="db__trending-row">
          {TRENDING.map((item, i) => <TrendingCard key={item.id} item={item} index={i} />)}
        </div>
      </section>

      {/* ── Recent Reels ── */}
      <section className="db__section">
        <div className="db__section-head">
          <h2 className="db__section-title">🎬 Recent Reels</h2>
          {/* <a href="#" className="db__see-all">See all →</a> */}
        </div>

        {/* Category Filter */}
        <div className="db__cats">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`db__cat ${activeCategory === cat ? "db__cat--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reels List */}
        <div className="db__reels-list">
          {filteredReels.length > 0
            ? filteredReels.map((r, i) => <ReelRow key={r.id} reel={r} index={i} />)
            : <p className="db__empty">No reels found. Try a different filter.</p>
          }
        </div>
      </section>

    </div>
     </div>
  );
}
