import type { CitizenPage, CitizenNavigateFn } from "../lib/types";
import {
  HomeIcon,
  ServiceIcon,
  MyRequestIcon,
  ComplaintsIcon,
  BillsIcon,
  DamageIcon,
  BellIcon,
  AccountIcon,
  ChevronRightIcon,
} from "../lib/icons";
import Logo from "../assets/logo.png";

interface Props {
  current: CitizenPage;
  navigate: CitizenNavigateFn;
  onLogout: () => void;
  children: React.ReactNode;
}

const mainNav: { key: CitizenPage; label: string; icon: React.ReactNode }[] = [
  { key: "home", label: "Home", icon: <HomeIcon /> },
  { key: "services", label: "Services", icon: <ServiceIcon /> },
  { key: "my-requests", label: "My Request", icon: <MyRequestIcon /> },
  { key: "complaints", label: "Complaints", icon: <ComplaintsIcon /> },
  { key: "utility-bills", label: "Utility Bills", icon: <BillsIcon /> },
  {
    key: "damage-assessment",
    label: "Damage assessment",
    icon: <DamageIcon />,
  },
];

const bottomNav: { key: CitizenPage; label: string; icon: React.ReactNode }[] =
  [
    { key: "notifications", label: "Notifications", icon: <BellIcon /> },
    { key: "account", label: "Account", icon: <AccountIcon /> },
  ];

function isActive(current: CitizenPage, key: CitizenPage): boolean {
  if (current === key) return true;
  if (
    key === "services" &&
    (current === "service-detail" || current === "service-request")
  )
    return true;
  if (key === "my-requests" && current === "request-detail") return true;
  if (key === "complaints" && current === "new-complaint") return true;
  if (key === "utility-bills" && current === "pay-bill") return true;
  return false;
}

export default function CitizenLayout({
  current,
  navigate,
  onLogout,
  children,
}: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className="w-52 flex flex-col flex-shrink-0 text-white"
        style={{ background: "#0d3a47" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
          <img src={Logo} alt="" className="w-8 h-8" />
          <div>
            <div className="text-xs font-bold leading-tight text-teal-300">
              Thecnho
            </div>
            <div className="text-xs font-bold leading-tight text-white">
              Amar
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {mainNav.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(current, item.key)
                  ? "bg-sidebar-active text-white"
                  : "text-teal-100 hover:bg-white/10"
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              <ChevronRightIcon />
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-white/20 mb-2" />

        {/* Bottom nav */}
        <div className="px-2 pb-4 space-y-0.5">
          {bottomNav.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                current === item.key
                  ? "bg-sidebar-active text-white"
                  : "text-teal-100 hover:bg-white/10"
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              <ChevronRightIcon />
            </button>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <header
          className="h-14 flex items-center justify-between px-6 flex-shrink-0"
          style={{ background: "#0d3a47" }}
        >
          <div />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white">
                AM
              </div>
              <span className="text-white text-sm font-medium">
                Ahmed Mohamed
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-teal-300 text-xs hover:text-white underline"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
