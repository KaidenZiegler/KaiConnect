"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  CookingPot,
  HeartHandshake,
  Leaf,
  LoaderCircle,
  MapPin,
  Minus,
  PackageOpen,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  Settings2,
  ShoppingBasket,
  Sparkles,
  Sprout,
  Trash2,
  Users,
  WandSparkles,
  X,
} from "lucide-react";

export type PantryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: "Produce" | "Meat" | "Dairy" | "Pantry";
  urgency: "today" | "soon" | "fresh" | "long";
  expiry: string;
  emoji: string;
  selected?: boolean;
};

export type Meal = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  home: string[];
  buy: string[];
  cost: number;
  servings: number;
  minutes: number;
  nutrition: string;
  rescued: string[];
  steps: string[];
};

type Page = "pantry" | "recipes" | "impact";

type FoodBank = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
};

const verifiedFoodBanks: FoodBank[] = [
  { name: "Auckland City Mission – Food Security", address: "195 Federal Street, Auckland Central", latitude: -36.8498, longitude: 174.7622, phone: "0800 864 357", website: "https://aucklandcitymission.org.nz/get-help/food/" },
  { name: "Wellington City Mission – Whakamaru", address: "4–8 Oxford Terrace, Mount Cook, Wellington", latitude: -41.3018, longitude: 174.7755, phone: "04 245 0900", website: "https://wellingtoncitymission.org.nz/what-we-do/social-supermarket/" },
  { name: "Christchurch City Mission", address: "276–284 Hereford Street, Christchurch Central", latitude: -43.5305, longitude: 172.6461, phone: "03 365 0635", website: "https://www.citymission.org.nz/contact" },
  { name: "Dunedin Salvation Army", address: "160 Crawford Street, Dunedin Central", latitude: -45.8797, longitude: 170.5011, phone: "0800 53 00 00", website: "https://www.salvationarmy.org.nz/help-us/food-banks/" },
  { name: "Auckland City Salvation Army", address: "18 Allright Place, Mount Wellington, Auckland", latitude: -36.9136, longitude: 174.8398, phone: "0800 53 00 00", website: "https://www.salvationarmy.org.nz/help-us/food-banks/" },
];

function distanceInKm(fromLatitude: number, fromLongitude: number, toLatitude: number, toLongitude: number) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDistance = radians(toLatitude - fromLatitude);
  const longitudeDistance = radians(toLongitude - fromLongitude);
  const value = Math.sin(latitudeDistance / 2) ** 2 + Math.cos(radians(fromLatitude)) * Math.cos(radians(toLatitude)) * Math.sin(longitudeDistance / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

const seedPantry: PantryItem[] = [
  { id: "p1", name: "Chicken breast", quantity: 600, unit: "g", category: "Meat", urgency: "today", expiry: "Today", emoji: "🍗" },
  { id: "p2", name: "Broccoli", quantity: 1, unit: "head", category: "Produce", urgency: "today", expiry: "Today", emoji: "🥦" },
  { id: "p3", name: "Milk", quantity: 1, unit: "L", category: "Dairy", urgency: "soon", expiry: "2 days", emoji: "🥛" },
  { id: "p4", name: "Bread", quantity: 8, unit: "slices", category: "Pantry", urgency: "soon", expiry: "2 days", emoji: "🍞" },
  { id: "p5", name: "Bananas", quantity: 4, unit: "", category: "Produce", urgency: "soon", expiry: "3 days", emoji: "🍌" },
  { id: "p6", name: "Spinach", quantity: 200, unit: "g", category: "Produce", urgency: "soon", expiry: "3 days", emoji: "🥬" },
  { id: "p7", name: "Carrots", quantity: 5, unit: "", category: "Produce", urgency: "fresh", expiry: "6 days", emoji: "🥕" },
  { id: "p8", name: "Eggs", quantity: 8, unit: "", category: "Dairy", urgency: "fresh", expiry: "8 days", emoji: "🥚" },
  { id: "p9", name: "Cheese", quantity: 250, unit: "g", category: "Dairy", urgency: "fresh", expiry: "9 days", emoji: "🧀" },
  { id: "p10", name: "Potatoes", quantity: 1.5, unit: "kg", category: "Produce", urgency: "fresh", expiry: "10 days", emoji: "🥔" },
  { id: "p11", name: "Rice", quantity: 1, unit: "kg", category: "Pantry", urgency: "long", expiry: "6 months", emoji: "🍚" },
  { id: "p12", name: "Pasta", quantity: 500, unit: "g", category: "Pantry", urgency: "long", expiry: "8 months", emoji: "🍝" },
  { id: "p13", name: "Canned tomatoes", quantity: 3, unit: "cans", category: "Pantry", urgency: "long", expiry: "1 year", emoji: "🥫" },
  { id: "p14", name: "Red lentils", quantity: 400, unit: "g", category: "Pantry", urgency: "long", expiry: "10 months", emoji: "🫘" },
];

const recipeIdeas: Meal[] = [
  {
    id: "r1",
    name: "Chicken & vegetable rice bowls",
    emoji: "🍚",
    description: "Tender chicken and crisp vegetables over fluffy rice with a simple savoury glaze.",
    home: ["Chicken breast", "Rice", "Broccoli", "Carrots"],
    buy: ["Soy sauce"],
    cost: 3.5,
    servings: 4,
    minutes: 25,
    nutrition: "520 kcal · 38g protein · 3 of 5-a-day",
    rescued: ["Chicken breast", "Broccoli"],
    steps: ["Cook the rice according to the packet.", "Slice the chicken and vegetables into bite-sized pieces.", "Brown chicken, then add vegetables and stir-fry until tender.", "Add soy sauce, toss well, and serve over rice."],
  },
  {
    id: "r2",
    name: "Golden pantry frittata",
    emoji: "🍳",
    description: "A flexible, protein-rich dinner that gives leftover vegetables a purpose.",
    home: ["Eggs", "Spinach", "Potatoes", "Cheese", "Milk"],
    buy: [],
    cost: 0,
    servings: 4,
    minutes: 22,
    nutrition: "440 kcal · 24g protein · 2 of 5-a-day",
    rescued: ["Spinach", "Milk"],
    steps: ["Slice the vegetables and cook until just tender.", "Whisk eggs with a splash of milk and season.", "Pour over the vegetables and add cheese.", "Cook gently until set, then finish under the grill."],
  },
  {
    id: "r3",
    name: "Tomato lentil cottage pie",
    emoji: "🥧",
    description: "Rich tomato lentils under a golden potato topping.",
    home: ["Red lentils", "Canned tomatoes", "Potatoes", "Carrots"],
    buy: ["Frozen peas"],
    cost: 3.9,
    servings: 4,
    minutes: 45,
    nutrition: "480 kcal · 22g protein · 4 of 5-a-day",
    rescued: ["Carrots"],
    steps: ["Boil and mash potatoes.", "Simmer lentils, tomatoes, carrots, and peas until thick.", "Top with mash and bake until lightly browned."],
  },
  {
    id: "r4",
    name: "Warm banana bread pudding",
    emoji: "🍌",
    description: "A cosy, lightly spiced pudding that saves ripe bananas, bread, and milk from going to waste.",
    home: ["Bananas", "Bread", "Milk", "Eggs"],
    buy: ["Cinnamon"],
    cost: 1.2,
    servings: 4,
    minutes: 35,
    nutrition: "330 kcal · 10g protein · naturally sweetened",
    rescued: ["Bananas", "Bread", "Milk"],
    steps: ["Tear the bread into a small baking dish and slice the bananas over it.", "Whisk the milk, eggs, and cinnamon together.", "Pour over the bread and leave to soak for 5 minutes.", "Bake at 180°C until golden and just set."],
  },
  {
    id: "r5",
    name: "Creamy broccoli & potato soup",
    emoji: "🥣",
    description: "A smooth, comforting soup that turns everyday vegetables and a splash of milk into an easy meal.",
    home: ["Broccoli", "Potatoes", "Milk", "Cheese"],
    buy: ["Vegetable stock"],
    cost: 1.8,
    servings: 4,
    minutes: 30,
    nutrition: "310 kcal · 15g protein · 2 of 5-a-day",
    rescued: ["Broccoli", "Milk"],
    steps: ["Chop the broccoli and potatoes into small pieces.", "Simmer with vegetable stock until everything is tender.", "Blend until smooth, then stir through the milk.", "Season, top with grated cheese, and serve warm."],
  },
  {
    id: "r6",
    name: "Chicken & spinach pasta",
    emoji: "🍝",
    description: "A quick, creamy pasta that uses tender chicken and wilting spinach in one satisfying dinner.",
    home: ["Chicken breast", "Spinach", "Pasta", "Cheese"],
    buy: ["Garlic"],
    cost: 1.5,
    servings: 4,
    minutes: 25,
    nutrition: "560 kcal · 42g protein · 1 of 5-a-day",
    rescued: ["Chicken breast", "Spinach"],
    steps: ["Cook the pasta, reserving a cup of its cooking water.", "Slice and brown the chicken with the garlic.", "Add the spinach and cook until just wilted.", "Toss through the pasta with cheese and enough cooking water to make a silky sauce."],
  },
  {
    id: "r7",
    name: "Cheesy spinach toasties",
    emoji: "🥪",
    description: "Crisp golden toasties filled with melted cheese and spinach for a fast, low-waste lunch.",
    home: ["Bread", "Cheese", "Spinach", "Milk"],
    buy: [],
    cost: 0,
    servings: 4,
    minutes: 15,
    nutrition: "390 kcal · 18g protein · 1 of 5-a-day",
    rescued: ["Bread", "Spinach", "Milk"],
    steps: ["Wilt the spinach in a pan and squeeze out any excess moisture.", "Layer spinach and grated cheese between slices of bread.", "Brush the outsides lightly with milk or oil.", "Toast in a pan until crisp and the cheese has melted."],
  },
];

const navItems = [
  { id: "pantry" as const, label: "Pantry", icon: PackageOpen },
  { id: "recipes" as const, label: "Recipes", icon: BookOpen },
  { id: "impact" as const, label: "Impact", icon: BarChart3 },
];

const nzd = new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" });

const demoReceiptItems: Omit<PantryItem, "id">[] = [
  { name: "Organic bananas", quantity: 3, unit: "items", category: "Produce", urgency: "soon", expiry: "3 days", emoji: "🍌" },
  { name: "Whole wheat bread", quantity: 2, unit: "loaves", category: "Pantry", urgency: "soon", expiry: "4 days", emoji: "🍞" },
  { name: "2% milk", quantity: 1, unit: "gallon", category: "Dairy", urgency: "fresh", expiry: "7 days", emoji: "🥛" },
  { name: "Fresh ground coffee", quantity: 12, unit: "oz", category: "Pantry", urgency: "long", expiry: "Long life", emoji: "☕" },
];

export function KaiConnectApp() {
  const [activePage, setActivePage] = useState<Page>("pantry");
  const [pantry, setPantry] = useState(seedPantry);
  const [cookedCount, setCookedCount] = useState(3);
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "1", unit: "item", category: "Produce" as PantryItem["category"] });
  const notificationRef = useRef<HTMLDivElement>(null);

  // Hydrate browser-only persisted state after the server-rendered first pass.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kai-connect-focused-state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pantry) setPantry(parsed.pantry);
        if (typeof parsed.cookedCount === "number") setCookedCount(parsed.cookedCount);
      }
    } catch { /* Seeded data remains available. */ }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    try { localStorage.setItem("kai-connect-focused-state", JSON.stringify({ pantry, cookedCount })); }
    catch { /* Persistence is never a blocker. */ }
  }, [pantry, cookedCount]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!showNotifications) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!notificationRef.current?.contains(event.target as Node)) setShowNotifications(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowNotifications(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [showNotifications]);

  const urgentItems = pantry.filter((item) => item.urgency === "today" || item.urgency === "soon");
  const urgentCount = urgentItems.length;
  const navigate = (page: Page) => { setActivePage(page); setShowNotifications(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const updateQuantity = (id: string, delta: number) => setPantry((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(0, Number((item.quantity + delta).toFixed(1))) } : item));

  const addItem = () => {
    if (!newItem.name.trim()) return;
    setPantry((items) => [{ id: `p-${Date.now()}`, name: newItem.name.trim(), quantity: Number(newItem.quantity) || 1, unit: newItem.unit, category: newItem.category, urgency: "fresh", expiry: "7 days", emoji: "🥣" }, ...items]);
    setNewItem({ name: "", quantity: "1", unit: "item", category: "Produce" });
    setShowAdd(false);
    setToast("Added to your pantry");
  };

  const addReceiptItems = () => {
    const scannedAt = Date.now();
    setPantry((items) => [
      ...demoReceiptItems.map((item, index) => ({ ...item, id: `receipt-${scannedAt}-${index}` })),
      ...items,
    ]);
    setShowAdd(false);
    setToast("4 foods scanned and added to your pantry");
  };

  const useItUp = () => {
    setPantry((items) => items.map((item) => ({ ...item, selected: item.urgency === "today" || item.urgency === "soon" })));
    navigate("recipes");
    setToast("Use-soon ingredients selected");
  };

  const markCooked = () => {
    setCookedCount((count) => count + 1);
    setRecipe(null);
    setToast("Meal recorded in your impact");
  };

  const resetDemo = () => {
    setPantry(seedPantry);
    setCookedCount(3);
    setToast("Demo restored");
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => navigate("pantry")} aria-label="kAI Connect pantry"><span className="brand-mark"><Sprout size={22} strokeWidth={2.4} /></span><span><strong>kAI Connect</strong><small>Waste less, together</small></span></button>
      <nav className="main-nav" aria-label="Main navigation"><p className="nav-kicker">Your food</p>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={activePage === id ? "nav-item active" : "nav-item"} onClick={() => navigate(id)}><Icon size={19} /><span>{label}</span></button>)}</nav>
    </aside>

    <main className="main-area">
      <header className="topbar"><div><span className="mobile-brand"><Sprout size={19} /> kAI Connect</span><h1>{navItems.find((item) => item.id === activePage)?.label}</h1></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={19} /></button><div className="notification-wrapper" ref={notificationRef}><button className={`icon-button notification ${showNotifications ? "active" : ""}`} aria-label={`${urgentCount} food expiry notifications`} aria-expanded={showNotifications} aria-controls="expiry-notifications" onClick={() => setShowNotifications((open) => !open)}><Bell size={19} />{urgentCount > 0 && <span className="notification-dot" />}</button>{showNotifications && <ExpiryNotifications items={urgentItems} close={() => setShowNotifications(false)} viewPantry={() => navigate("pantry")} useItUp={useItUp} />}</div></div></header>
      <div className="page-content">
        {activePage === "pantry" && <Pantry pantry={pantry} showAdd={showAdd} setShowAdd={setShowAdd} newItem={newItem} setNewItem={setNewItem} addItem={addItem} addReceiptItems={addReceiptItems} updateQuantity={updateQuantity} removeItem={(id) => setPantry((items) => items.filter((item) => item.id !== id))} selectItem={(id) => setPantry((items) => items.map((item) => item.id === id ? { ...item, selected: !item.selected } : item))} useItUp={useItUp} />}
        {activePage === "recipes" && <Recipes pantry={pantry} setPantry={setPantry} openRecipe={setRecipe} />}
        {activePage === "impact" && <Impact cookedCount={cookedCount} pantry={pantry} />}
      </div>
    </main>

    <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={activePage === id ? "active" : ""} onClick={() => navigate(id)}><Icon size={19} /><span>{label}</span></button>)}</nav>
    {recipe && <RecipeModal meal={recipe} close={() => setRecipe(null)} markCooked={markCooked} />}
    {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    <button className="reset-demo" onClick={resetDemo} title="Reset demo"><RotateCcw size={15} /> Reset demo</button>
  </div>;
}

function ExpiryNotifications({ items, close, viewPantry, useItUp }: { items: PantryItem[]; close: () => void; viewPantry: () => void; useItUp: () => void }) {
  const todayCount = items.filter((item) => item.urgency === "today").length;

  return <section id="expiry-notifications" className="notification-popover" role="dialog" aria-modal="false" aria-labelledby="expiry-notifications-title">
    <div className="notification-heading">
      <div><span className="notification-heading-icon"><Bell size={16} /></span><div><h2 id="expiry-notifications-title">Food to use soon</h2><p>{items.length ? `${items.length} ${items.length === 1 ? "item needs" : "items need"} your attention` : "Everything is looking fresh"}</p></div></div>
      <button onClick={close} aria-label="Close notifications"><X size={17} /></button>
    </div>
    {items.length ? <>
      <div className="notification-summary"><span className="summary-dot today" /><strong>{todayCount ? `${todayCount} ${todayCount === 1 ? "item" : "items"} to use today` : "Nothing expires today"}</strong><span>Prioritised by expiry</span></div>
      <div className="notification-list">{items.map((item) => <button key={item.id} className="expiry-notification" onClick={viewPantry}>
        <span className="notification-food-icon">{item.emoji}</span>
        <span><strong>{item.name}</strong><small>{item.quantity} {item.unit || (item.quantity === 1 ? "item" : "items")} · {item.category}</small></span>
        <em className={item.urgency}>{item.urgency === "today" ? "Use today" : `In ${item.expiry}`}</em>
      </button>)}</div>
      <div className="notification-actions"><button onClick={viewPantry}>View pantry</button><button onClick={useItUp}><WandSparkles size={15} /> Find recipes</button></div>
    </> : <div className="notification-empty"><CheckCircle2 size={25} /><strong>No food needs attention</strong><p>We’ll let you know when something is close to expiry.</p></div>}
  </section>;
}

function Pantry({ pantry, showAdd, setShowAdd, newItem, setNewItem, addItem, addReceiptItems, updateQuantity, removeItem, selectItem, useItUp }: { pantry: PantryItem[]; showAdd: boolean; setShowAdd: (value: boolean) => void; newItem: { name: string; quantity: string; unit: string; category: PantryItem["category"] }; setNewItem: (value: { name: string; quantity: string; unit: string; category: PantryItem["category"] }) => void; addItem: () => void; addReceiptItems: () => void; updateQuantity: (id: string, delta: number) => void; removeItem: (id: string) => void; selectItem: (id: string) => void; useItUp: () => void }) {
  const [addMode, setAddMode] = useState<"choose" | "manual" | "scanner">("choose");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "ready">("idle");
  const [donationItem, setDonationItem] = useState<PantryItem | null>(null);
  const [foodBankStatus, setFoodBankStatus] = useState<"idle" | "searching" | "ready" | "error">("idle");
  const [nearestFoodBank, setNearestFoodBank] = useState<(FoodBank & { distance: number }) | null>(null);
  const groups: { id: PantryItem["urgency"]; title: string; copy: string }[] = [
    { id: "today", title: "Use today", copy: "Highest priority" },
    { id: "soon", title: "Use soon", copy: "Within 3 days" },
    { id: "fresh", title: "Fresh", copy: "Good for the week" },
    { id: "long", title: "Long life", copy: "Pantry staples" },
  ];

  const toggleAddFood = () => {
    if (!showAdd) {
      setAddMode("choose");
      setScanState("idle");
    }
    setShowAdd(!showAdd);
  };

  const scanReceipt = () => {
    setScanState("scanning");
    window.setTimeout(() => setScanState("ready"), 1100);
  };

  const openDonation = (item: PantryItem) => {
    setDonationItem(item);
    setNearestFoodBank(null);
    setFoodBankStatus("idle");
  };

  const findNearestFoodBank = () => {
    if (!navigator.geolocation) {
      setFoodBankStatus("error");
      return;
    }

    setFoodBankStatus("searching");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      let candidates = verifiedFoodBanks;
      try {
        const overpassQuery = `[out:json][timeout:12];(nwr(around:50000,${coords.latitude},${coords.longitude})["social_facility"="food_bank"];nwr(around:50000,${coords.latitude},${coords.longitude})["name"~"food.?bank|city mission|salvation army",i];);out center tags;`;
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        if (response.ok) {
          const data = await response.json() as { elements?: Array<{ lat?: number; lon?: number; center?: { lat?: number; lon?: number }; tags?: Record<string, string> }> };
          const nearbyListings = (data.elements ?? []).flatMap((entry): FoodBank[] => {
            const latitude = entry.lat ?? entry.center?.lat;
            const longitude = entry.lon ?? entry.center?.lon;
            const tags = entry.tags ?? {};
            if (latitude === undefined || longitude === undefined || !tags.name) return [];
            const address = tags["addr:full"] ?? [tags["addr:housenumber"], tags["addr:street"], tags["addr:suburb"], tags["addr:city"]].filter(Boolean).join(" ") ?? "Local food bank";
            return [{ name: tags.name, address: address || "Local food bank", latitude, longitude, phone: tags.phone, website: tags.website }];
          });
          if (nearbyListings.length) candidates = [...nearbyListings, ...verifiedFoodBanks];
        }
      } catch { /* The verified directory remains available as a fallback. */ }

      const closest = candidates
        .map((foodBank) => ({ ...foodBank, distance: distanceInKm(coords.latitude, coords.longitude, foodBank.latitude, foodBank.longitude) }))
        .sort((first, second) => first.distance - second.distance)[0];
      setNearestFoodBank(closest);
      setFoodBankStatus("ready");
    }, () => setFoodBankStatus("error"), { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  };

  return <>
    <section className="page-intro"><div><p className="eyebrow">{pantry.length} ITEMS · {pantry.filter((item) => item.urgency === "today" || item.urgency === "soon").length} NEED ATTENTION</p><h2>Your pantry, sorted by urgency</h2><p>See what needs using first. Select ingredients to turn them into a low-cost meal.</p></div><div className="intro-actions"><button className="secondary-button" onClick={toggleAddFood} aria-expanded={showAdd}><Plus size={17} /> Add food</button><button className="primary-button" onClick={useItUp}><WandSparkles size={17} /> Use it up</button></div></section>

    {showAdd && <section className="panel add-food-panel" aria-label="Add food">
      <div className="add-food-heading">
        <div><span className="section-icon green"><Plus size={18} /></span><div><h3>Add food to your pantry</h3><p>{addMode === "choose" ? "Choose how you want to add your food." : addMode === "manual" ? "Enter one pantry item." : "Scan the sample receipt to find purchased food."}</p></div></div>
        <button className="panel-close" onClick={() => setShowAdd(false)} aria-label="Close add food"><X size={18} /></button>
      </div>

      {addMode === "choose" && <div className="add-methods">
        <button onClick={() => setAddMode("manual")}><span className="method-icon"><Plus size={24} /></span><strong>Type it in manually</strong><small>Add a food, quantity, unit, and category.</small><em>Choose manual entry <ArrowRight size={15} /></em></button>
        <button onClick={() => setAddMode("scanner")}><span className="method-icon receipt"><Camera size={24} /></span><strong>Scan a receipt</strong><small>Try the mock scanner with the provided receipt.</small><em>Open demo scanner <ArrowRight size={15} /></em></button>
      </div>}

      {addMode === "manual" && <div className="add-mode-body">
        <button className="back-link" onClick={() => setAddMode("choose")}><ArrowRight size={14} /> Back to options</button>
        <div className="add-form"><input aria-label="Ingredient name" placeholder="Ingredient name" value={newItem.name} onChange={(event) => setNewItem({ ...newItem, name: event.target.value })} /><input aria-label="Quantity" type="number" min="0" value={newItem.quantity} onChange={(event) => setNewItem({ ...newItem, quantity: event.target.value })} /><select aria-label="Unit" value={newItem.unit} onChange={(event) => setNewItem({ ...newItem, unit: event.target.value })}><option>item</option><option>g</option><option>kg</option><option>mL</option><option>L</option></select><select aria-label="Category" value={newItem.category} onChange={(event) => setNewItem({ ...newItem, category: event.target.value as PantryItem["category"] })}><option>Produce</option><option>Meat</option><option>Dairy</option><option>Pantry</option></select><button className="primary-button" onClick={addItem}>Add to pantry</button></div>
      </div>}

      {addMode === "scanner" && <div className="scanner-layout">
        <div className={`mock-receipt ${scanState === "scanning" ? "scanning" : ""}`}>
          <div className="receipt-store"><ReceiptText size={20} /><strong>Sample receipt</strong><small>15/03/2024 · Register 07</small></div>
          <div className="receipt-lines"><span>3× Organic Bananas</span><strong>$9</strong><span>2× Whole Wheat Bread</span><strong>$16</strong><span>2% Milk — Gallon</span><strong>$4</strong><span>Fresh Ground Coffee 12oz</span><strong>$10</strong></div>
          <div className="receipt-total"><span>Total</span><strong>$24</strong></div>
          {scanState === "scanning" && <div className="scan-line" />}
        </div>
        <div className="scanner-copy">
          <button className="back-link" onClick={() => { setAddMode("choose"); setScanState("idle"); }}><ArrowRight size={14} /> Back to options</button>
          <span className="demo-badge">Demo scanner</span>
          <h3>{scanState === "ready" ? "4 foods found" : scanState === "scanning" ? "Reading your receipt…" : "Ready to scan"}</h3>
          <p>{scanState === "ready" ? "Check the recognized foods, then add them all to your pantry." : "This mock scan uses the receipt you provided. No image is uploaded or stored."}</p>
          {scanState === "ready" && <ul className="scan-results">{demoReceiptItems.map((item) => <li key={item.name}><span>{item.emoji}</span><div><strong>{item.name}</strong><small>{item.quantity} {item.unit} · {item.category}</small></div><CheckCircle2 size={18} /></li>)}</ul>}
          {scanState !== "ready" ? <button className="primary-button big scan-button" onClick={scanReceipt} disabled={scanState === "scanning"}><Camera size={18} />{scanState === "scanning" ? "Scanning…" : "Scan sample receipt"}</button> : <button className="primary-button big scan-button" onClick={addReceiptItems}><CheckCircle2 size={18} /> Add 4 foods to pantry</button>}
        </div>
      </div>}
    </section>}

    {donationItem && <div className="modal-backdrop"><section className="donation-modal" role="dialog" aria-modal="true" aria-labelledby="donation-title">
      <button className="modal-close" onClick={() => setDonationItem(null)} aria-label="Close food bank finder"><X size={20} /></button>
      <span className="donation-mark"><HeartHandshake size={28} /></span>
      <p className="eyebrow">SHARE SURPLUS FOOD</p>
      <h2 id="donation-title">Donate {donationItem.name.toLowerCase()} nearby</h2>
      <p className="donation-lead">Find the closest available food-bank listing and contact them before travelling.</p>
      <div className="donation-warning"><strong>Check before donating</strong><span>Only donate unopened food that is safe and within its use-by date. Many food banks cannot accept chilled, frozen, opened, or same-day-expiry food.</span></div>

      {foodBankStatus === "idle" && <button className="primary-button big find-foodbank" onClick={findNearestFoodBank}><MapPin size={18} /> Use my location</button>}
      {foodBankStatus === "searching" && <div className="finding-foodbank" role="status"><LoaderCircle size={22} /><span><strong>Finding your closest option…</strong><small>This can take a few seconds.</small></span></div>}
      {foodBankStatus === "ready" && nearestFoodBank && <div className="foodbank-result">
        <span className="result-pin"><MapPin size={22} /></span>
        <div><small>Closest available listing · {nearestFoodBank.distance < 10 ? nearestFoodBank.distance.toFixed(1) : Math.round(nearestFoodBank.distance)} km away</small><h3>{nearestFoodBank.name}</h3><p>{nearestFoodBank.address}</p>{nearestFoodBank.phone && <a href={`tel:${nearestFoodBank.phone.replace(/\s/g, "")}`}>Call {nearestFoodBank.phone}</a>}</div>
        <a className="primary-button" href={`https://www.google.com/maps/dir/?api=1&destination=${nearestFoodBank.latitude},${nearestFoodBank.longitude}`} target="_blank" rel="noreferrer">Directions <ArrowRight size={15} /></a>
      </div>}
      {foodBankStatus === "error" && <div className="foodbank-error"><strong>We couldn’t access your location.</strong><span>You can still search the nationwide food-bank directory by region.</span><a className="secondary-button" href="https://www.foodbank.co.nz/foodbanks" target="_blank" rel="noreferrer">Open food-bank directory <ArrowRight size={15} /></a></div>}
      <p className="directory-note">Listings are sourced from local map data and verified NZ providers. Always call to confirm what they currently accept.</p>
    </section></div>}

    <div className="pantry-toolbar"><p><span>{pantry.filter((item) => item.selected).length}</span> selected for recipe ideas</p><button className="filter-button"><Settings2 size={15} /> All categories <ChevronDown size={14} /></button></div>
    <div className="pantry-groups">{groups.map((group) => { const items = pantry.filter((item) => item.urgency === group.id); return <section key={group.id} className={`pantry-group ${group.id}`}><header><div><span className="urgency-dot" /><h3>{group.title}</h3><em>{items.length}</em></div><p>{group.copy}</p></header><div className="pantry-cards">{items.map((item) => <article key={item.id} className={`pantry-card ${item.selected ? "selected" : ""}`}><button className="select-food" onClick={() => selectItem(item.id)} aria-label={`Select ${item.name}`}>{item.selected && <Check size={14} />}</button><span className="food-big">{item.emoji}</span><div className="pantry-copy"><strong>{item.name}</strong><small>{item.category} · expires {item.expiry.toLowerCase()}</small>{(item.urgency === "today" || item.urgency === "soon") && <button className="donate-food" onClick={() => openDonation(item)}><HeartHandshake size={14} /> Donate nearby</button>}</div><div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity < 10 ? -1 : -100)} aria-label="Reduce quantity"><Minus size={13} /></button><span>{item.quantity} {item.unit}</span></div><button className="delete-button" onClick={() => removeItem(item.id)} aria-label={`Delete ${item.name}`}><Trash2 size={15} /></button></article>)}</div></section>; })}</div>
  </>;
}

function Recipes({ pantry, setPantry, openRecipe }: { pantry: PantryItem[]; setPantry: (items: PantryItem[]) => void; openRecipe: (meal: Meal) => void }) {
  const selected = pantry.filter((item) => item.selected);
  const selectedNames = new Set(selected.map((item) => item.name));
  const matchingRecipe = selected.length ? recipeIdeas.reduce((best, meal) => {
    const score = meal.home.filter((ingredient) => selectedNames.has(ingredient)).length;
    const bestScore = best.home.filter((ingredient) => selectedNames.has(ingredient)).length;
    return score > bestScore ? meal : best;
  }, recipeIdeas[0]) : recipeIdeas[1];
  const customRecipe: Meal = {
    ...matchingRecipe,
    rescued: pantry
      .filter((item) => matchingRecipe.home.includes(item.name) && (item.urgency === "today" || item.urgency === "soon"))
      .map((item) => item.name),
  };
  return <>
    <section className="recipe-builder"><div className="builder-copy"><span className="ai-badge"><Sparkles size={15} /> AI recipe maker</span><h2>Make something with what you have</h2><p>Pick a few pantry ingredients and kAI Connect will turn them into a simple, low-cost meal.</p><div className="selected-chips">{pantry.map((item) => <button key={item.id} className={item.selected ? "selected" : ""} aria-pressed={Boolean(item.selected)} onClick={() => setPantry(pantry.map((current) => current.id === item.id ? { ...current, selected: !current.selected } : current))}><span>{item.emoji}</span>{item.name}{item.selected && <Check size={13} />}</button>)}</div><div className="recipe-builder-action"><button className="primary-button big" onClick={() => openRecipe(customRecipe)}><WandSparkles size={18} /> Make something with these</button><p aria-live="polite"><Sparkles size={13} /> {selected.length ? `Best match: ${matchingRecipe.name}` : "Select ingredients for a tailored recipe"}</p></div></div><div className="builder-visual"><div className="pot-ring"><CookingPot size={58} /><span className="ingredient-orbit one">{selected[0]?.emoji || "🥦"}</span><span className="ingredient-orbit two">{selected[1]?.emoji || "🥚"}</span><span className="ingredient-orbit three">{selected[2]?.emoji || "🥔"}</span></div><p>{selected.length || 0} ingredients selected</p></div></section>
    <section className="recipe-suggestions"><div className="panel-heading"><div><span className="section-icon orange"><BookOpen size={18} /></span><div><h3>Cheap favourites for your pantry</h3><p>Quick ideas based on what’s at home</p></div></div></div><div className="recipe-grid">{recipeIdeas.map((meal) => <article key={meal.id}><div className="recipe-thumb">{meal.emoji}<span>{meal.minutes} min</span></div><div><h3>{meal.name}</h3><p>{meal.home.slice(0, 3).join(" · ")}</p><strong>{meal.cost ? `Only ${nzd.format(meal.cost)} extra` : "Nothing extra to buy"}</strong><button onClick={() => openRecipe(meal)}>View recipe <ArrowRight size={15} /></button></div></article>)}</div></section>
  </>;
}

function Impact({ cookedCount, pantry }: { cookedCount: number; pantry: PantryItem[] }) {
  const [checkedSuggestions, setCheckedSuggestions] = useState<string[]>([]);
  const suggestedItems = pantry.filter((item) => item.urgency === "today" || item.urgency === "soon").slice(0, 6);
  const checkedCount = suggestedItems.filter((item) => checkedSuggestions.includes(item.id)).length;
  const categoryEstimate: Record<PantryItem["category"], number> = { Produce: 3.5, Meat: 12, Dairy: 5.5, Pantry: 4 };
  const estimatedTotal = suggestedItems.reduce((total, item) => total + categoryEstimate[item.category], 0);
  const suggestedQuantity = (item: PantryItem) => {
    if (item.unit === "slices") return "1 loaf";
    return `${item.quantity} ${item.unit || (item.quantity === 1 ? "item" : "items")}`;
  };
  const toggleSuggestion = (id: string) => setCheckedSuggestions((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  return <>
    <section className="page-intro"><div><p className="eyebrow">YOUR IMPACT · AUGUST</p><h2>Small choices, meaningful change</h2><p>See how using what you already have supports your household budget and reduces waste.</p></div><span className="estimate-badge"><Leaf size={15} /> Environmental figures are estimates</span></section>
    <section className="impact-hero"><div><span className="impact-leaf"><Leaf size={27} /></span><p>This week your household used</p><strong>6 ingredients</strong><p>before they were likely to be wasted.</p></div><div className="impact-stats"><div><small>Saved this week</small><strong>$38</strong><span>estimated</span></div><div><small>Saved this month</small><strong>$122</strong><span>estimated</span></div><div><small>Meals cooked</small><strong>{cookedCount}</strong><span>using pantry food</span></div><div><small>Food rescued</small><strong>4.2 kg</strong><span>estimated</span></div></div></section>
    <section className="panel impact-shopping">
      <header className="impact-shopping-heading"><div><span className="section-icon orange"><ShoppingBasket size={18} /></span><div><p className="eyebrow">PLAN AHEAD</p><h2>Suggested shopping for next week</h2><span>Smart restocks based on what you’re using up this week.</span></div></div>{suggestedItems.length > 0 && <strong>{suggestedItems.length - checkedCount} left to get</strong>}</header>
      {suggestedItems.length ? <div className="impact-shopping-layout">
        <div className="impact-shopping-list">{suggestedItems.map((item) => {
          const checked = checkedSuggestions.includes(item.id);
          return <button key={item.id} className={checked ? "checked" : ""} onClick={() => toggleSuggestion(item.id)} aria-pressed={checked}>
            <span className="shopping-check">{checked && <Check size={14} />}</span>
            <span className="shopping-suggestion-emoji">{item.emoji}</span>
            <span><strong>{item.name}</strong><small>Current supply expires {item.expiry.toLowerCase()}</small></span>
            <em>{suggestedQuantity(item)}</em>
          </button>;
        })}</div>
        <aside className="shopping-insight"><span><Sparkles size={18} /></span><h3>Shop with less guesswork</h3><p>These restocks are suggested because you’re likely to finish the current items before next week.</p><div><small>Estimated basket</small><strong>{nzd.format(estimatedTotal)}</strong></div><div className="shopping-completion"><span style={{ width: `${suggestedItems.length ? (checkedCount / suggestedItems.length) * 100 : 0}%` }} /></div><small>{checkedCount} of {suggestedItems.length} items checked</small></aside>
      </div> : <div className="impact-shopping-empty"><CheckCircle2 size={24} /><div><strong>No restocks suggested yet</strong><p>Your pantry has enough food to carry into next week.</p></div></div>}
    </section>
  </>;
}

function RecipeModal({ meal, close, markCooked }: { meal: Meal; close: () => void; markCooked: () => void }) {
  // Clicking the backdrop is an optional shortcut; the dialog has a dedicated close button.
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><section className="recipe-modal" role="dialog" aria-modal="true" aria-labelledby="recipe-title"><button className="modal-close" onClick={close} aria-label="Close recipe"><X size={20} /></button><div className="recipe-modal-visual"><span>{meal.emoji}</span><div><Leaf size={15} /> {meal.rescued.length ? `Rescues ${meal.rescued.length} ingredients` : `Uses ${meal.home.length} pantry ingredients`}</div></div><div className="recipe-modal-body"><p className="eyebrow">USE-SOON RECIPE</p><h2 id="recipe-title">{meal.name}</h2><p className="recipe-lead">{meal.description}</p><div className="meal-facts modal-facts"><span><Clock3 size={16} />{meal.minutes} min</span><span><Users size={16} />Serves {meal.servings}</span><span><CircleDollarSign size={16} />{nzd.format(meal.cost)} extra</span></div><div className="reason-box"><Sparkles size={19} /><p><strong>Why kAI Connect chose this</strong>{meal.rescued.length ? `${meal.rescued.join(" and ")} need using soon. This meal gives them a purpose while keeping extra costs low.` : "This flexible recipe uses your selected pantry ingredients while keeping extra costs low."}</p></div><div className="recipe-columns"><div><h3>Ingredients</h3><h4>Using at home</h4><ul>{meal.home.map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}</ul><h4>Need to buy</h4><ul>{meal.buy.length ? meal.buy.map((item) => <li key={item}><Plus size={15} />{item}</li>) : <li><CheckCircle2 size={15} />Nothing extra</li>}</ul></div><div><h3>Method</h3><ol>{meal.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol></div></div><div className="nutrition-strip"><HeartHandshake size={18} /><span><strong>Nutrition estimate</strong>{meal.nutrition}</span><small>Approximate per serving</small></div><div className="modal-actions"><button className="secondary-button" onClick={close}>Back to recipes</button><button className="primary-button" onClick={markCooked}><CheckCircle2 size={17} /> Mark as cooked</button></div></div></section></div>;
}
