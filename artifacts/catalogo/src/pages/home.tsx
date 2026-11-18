import { useEffect, useMemo, useState } from "react";
import { Search, X, MessageCircle, ChevronRight, Instagram } from "lucide-react";
import productsData from "../../data/products.json";

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  code: string;
  image: string;
  images: string[];
  promo: boolean;
};

type Category = { name: string; icon: string };
type Config = {
  storeName: string;
  storeTagline: string;
  whatsapp: string;
  whatsappDisplay: string;
  instagram: string;
  whatsappMessage: string;
};

const config = productsData.config as Config;
const categories = productsData.categories as Category[];
const products = productsData.products as Product[];

const BASE = import.meta.env.BASE_URL;

/** Caminhos relativos (ex.: "products/x.jpg") passam a respeitar o base do site (GitHub Pages). */
function assetUrl(src: string) {
  if (!src || /^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  return BASE + src.replace(/^\//, "");
}

const instagramUrl = `https://instagram.com/${config.instagram}`;
const whatsappUrl = `https://wa.me/${config.whatsapp}`;

/** Ilustração exibida enquanto o produto não tem foto. */
function MugArt({ category }: { category: string }) {
  const ink = "#262626";
  const gold = "#C99A12";

  if (category === "Mágicas") {
    return (
      <svg className="mug-art" viewBox="0 0 200 200" aria-hidden="true">
        <path d="M140 82h10a22 22 0 0 1 0 44h-10" fill="none" stroke={ink} strokeWidth="9" />
        <rect x="52" y="62" width="92" height="96" rx="10" fill={ink} />
        <path d="M98 92l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill={gold} />
        <path d="M74 122l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z M122 80l2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill={gold} />
        <path d="M78 52c-6-8 6-12 0-20M98 52c-6-8 6-12 0-20M118 52c-6-8 6-12 0-20" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (category === "Chopp") {
    return (
      <svg className="mug-art" viewBox="0 0 200 200" aria-hidden="true">
        <path d="M138 80h12a20 20 0 0 1 20 20v14a20 20 0 0 1-20 20h-12" fill="none" stroke={ink} strokeWidth="8" />
        <rect x="56" y="70" width="86" height="98" rx="8" fill="#FBF3DC" stroke={ink} strokeWidth="5" />
        <rect x="61" y="96" width="76" height="67" rx="4" fill={gold} opacity="0.85" />
        <path d="M54 72c0-14 12-20 22-16 4-10 20-12 26-2 8-8 24-4 26 8 10 0 16 6 16 12Z" fill="#FFFFFF" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
        <path d="M80 108v46M99 108v46M118 108v46" stroke="#FFFFFF" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (category === "Kits Presente") {
    return (
      <svg className="mug-art" viewBox="0 0 200 200" aria-hidden="true">
        <rect x="40" y="96" width="120" height="72" rx="6" fill={ink} />
        <rect x="34" y="84" width="132" height="18" rx="4" fill={ink} />
        <rect x="94" y="84" width="12" height="84" fill={gold} />
        <path d="M100 84c-10-16-30-20-36-10 6 6 20 10 36 10Zm0 0c10-16 30-20 36-10-6 6-20 10-36 10Z" fill="none" stroke={gold} strokeWidth="5" strokeLinejoin="round" />
        <path d="M128 44h6a12 12 0 0 1 0 24h-6" fill="none" stroke={ink} strokeWidth="5" />
        <rect x="88" y="34" width="42" height="44" rx="5" fill="#FFFFFF" stroke={ink} strokeWidth="5" />
        <rect x="88" y="48" width="42" height="7" fill={gold} />
      </svg>
    );
  }

  // Cerâmica (padrão)
  return (
    <svg className="mug-art" viewBox="0 0 200 200" aria-hidden="true">
      <path d="M140 82h10a22 22 0 0 1 0 44h-10" fill="none" stroke={ink} strokeWidth="9" />
      <rect x="52" y="62" width="92" height="96" rx="10" fill="#FFFFFF" stroke={ink} strokeWidth="6" />
      <rect x="55" y="96" width="86" height="26" fill={gold} />
      <text x="98" y="114" textAnchor="middle" fontFamily="'DM Serif Display', Georgia, serif" fontSize="18" fill={ink}>Digo!</text>
      <path d="M78 52c-6-8 6-12 0-20M98 52c-6-8 6-12 0-20M118 52c-6-8 6-12 0-20" fill="none" stroke="#BDBDBD" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ProductImage({ product, src }: { product: Product; src?: string }) {
  const url = assetUrl(src ?? product.image);
  if (!url) return <MugArt category={product.category} />;
  return <img src={url} alt={product.name} loading="lazy" />;
}

function BrandMark({ size = 52 }: { size?: number }) {
  return <img className="brand-mark" src={`${BASE}branding/logo.svg`} alt="" width={size} height={size} />;
}

export default function Home() {
  const [activeCat, setActiveCat] = useState<string>("Todos");
  const [search, setSearch] = useState("");
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (openProduct) {
      setActiveImg(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [openProduct]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCat === "Todos" || p.category === activeCat;
      const term = search.trim().toLowerCase();
      const matchSearch = !term ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [activeCat, search]);

  const onCat = (c: string) => {
    setActiveCat(c);
    setSidebarOpen(false);
  };

  const buildWaLink = (p: Product) => {
    let msg = config.whatsappMessage;
    msg = msg.replace(/{nome}/g, p.name);
    msg = msg.replace(/{categoria}/g, p.category);
    msg = msg.replace(/{codigo}/g, p.code);
    msg = msg.replace(/{imagem}/g, p.image ? new URL(assetUrl(p.image), window.location.href).href : "");
    return `${whatsappUrl}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      <div className={`overlay ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Categorias</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
            <X size={18} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <button className={`category-btn ${activeCat === "Todos" ? "active" : ""}`} onClick={() => onCat("Todos")}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            <span>Todos os produtos</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              className={`category-btn ${activeCat === c.name ? "active" : ""}`}
              onClick={() => onCat(c.name)}
            >
              <span dangerouslySetInnerHTML={{ __html: c.icon }} />
              <span>{c.name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-contact">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <Instagram size={16} /> @{config.instagram}
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> {config.whatsappDisplay}
          </a>
        </div>
      </aside>

      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
              <span /><span /><span />
            </button>
            <a className="brand" href="#top" aria-label={config.storeName}>
              <BrandMark />
              <span className="brand-name">
                <span className="brand-name__title">Digo!</span>
                <span className="brand-name__sub">Brindes</span>
              </span>
            </a>
          </div>
          <div className="header-center">
            <div className="search-wrap">
              <Search size={18} className="search-icon" />
              <input
                className="search-input"
                type="search"
                placeholder="Buscar canecas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear visible" onClick={() => setSearch("")} aria-label="Limpar busca">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
          <div className="header-right">
            <span className="product-count">
              {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
            </span>
          </div>
        </div>
      </header>

      <main className="layout" id="top">
        <div className="main-content">

          <section className="hero">
            <BrandMark size={88} />
            <h1 className="hero__title">Canecas personalizadas</h1>
            <p className="hero__tagline">{config.storeTagline}</p>
            <div className="hero__actions">
              <a className="hero__btn hero__btn--dark" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} /> Pedir orçamento
              </a>
              <a className="hero__btn" href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <Instagram size={18} /> @{config.instagram}
              </a>
            </div>
          </section>

          <div className="filter-bar">
            <span className="filter-label">Exibindo:</span>
            <span className="filter-badge">
              {activeCat === "Todos" ? "Todos os produtos" : activeCat}
            </span>
            {activeCat !== "Todos" && (
              <button className="filter-clear" onClick={() => setActiveCat("Todos")}>
                Limpar filtro
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Search size={32} />
              </div>
              <h3>Nada por aqui</h3>
              <p>Tente outra categoria ou termo de busca.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="product-card"
                  onClick={() => window.open(buildWaLink(p), "_blank")}
                >
                  <div className="card-image-wrap">
                    <ProductImage product={p} />
                    <span className={`card-badge ${p.promo ? "promo" : ""}`}>
                      {p.promo ? "Promo" : p.category}
                    </span>
                  </div>
                  <div className="card-body">
                    <span className="card-category">{p.category}</span>
                    <h3 className="card-name">{p.name}</h3>
                    <p className="card-desc">{p.description}</p>
                    <span className="card-code">Cód. {p.code}</span>
                  </div>
                  <div className="card-footer">
                    <button
                      className="btn-interest"
                      onClick={(e) => { e.stopPropagation(); window.open(buildWaLink(p), "_blank"); }}
                    >
                      <MessageCircle size={16} />
                      Tenho interesse
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="site-footer">
          <span>© {new Date().getFullYear()} {config.storeName}</span>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">@{config.instagram}</a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">{config.whatsappDisplay}</a>
        </footer>
      </main>

      {openProduct && (
        <div className="modal-backdrop open" onClick={() => setOpenProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenProduct(null)} aria-label="Fechar">
              <X size={18} />
            </button>
            <div className="modal-inner">
              <div className="modal-gallery">
                <div className="modal-main-img-wrap">
                  <ProductImage product={openProduct} src={openProduct.images[activeImg] ?? openProduct.image} />
                </div>
                {openProduct.images.length > 1 && (
                  <div className="modal-thumbs">
                    {openProduct.images.map((src, i) => (
                      <button
                        key={i}
                        className={`modal-thumb ${i === activeImg ? "active" : ""}`}
                        onClick={() => setActiveImg(i)}
                      >
                        <img src={assetUrl(src)} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-info">
                <span className="modal-badge">{openProduct.category}</span>
                <h2 className="modal-title">{openProduct.name}</h2>
                <span className="modal-code">Cód. {openProduct.code}</span>
                <p className="modal-desc">{openProduct.description}</p>
                <a className="btn-whatsapp" href={buildWaLink(openProduct)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={20} />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
