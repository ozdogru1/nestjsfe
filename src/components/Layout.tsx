import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../app/auth';

export function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white/80 backdrop-blur">
        <div className="container-app flex flex-wrap items-center justify-between gap-4 py-4">
          <Link to="/products" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white">
              <span className="font-display text-lg">P</span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold">Product Hub</p>
              <p className="text-xs text-steel">Yönetim Paneli</p>
            </div>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-semibold text-steel">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${
                  isActive ? 'bg-mist text-ink' : 'hover:bg-mist hover:text-ink'
                }`
              }
            >
              Ürünler
            </NavLink>
            <button onClick={logout} className="btn btn-ghost">
              Çýkýþ Yap
            </button>
          </nav>
        </div>
      </header>
      <main className="container-app py-8">{children}</main>
    </div>
  );
}
