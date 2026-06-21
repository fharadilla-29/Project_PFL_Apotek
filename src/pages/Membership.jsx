import { useState } from "react";
import { MdCardMembership, MdStars, MdCardGiftcard, MdPeople, MdPointOfSale } from "react-icons/md";
import MemberTier     from "./membership/MemberTier";
import MemberPoints   from "./membership/MemberPoints";
import MemberBenefit  from "./membership/MemberBenefit";
import MemberDatabase from "./membership/MemberDatabase";
import MemberPOS      from "./membership/MemberPOS";
import membershipData from "../data/membership.json";

const TABS = [
  { id: "tier",     label: "Manajemen Tier",  icon: <MdCardMembership />, component: <MemberTier />     },
  { id: "points",   label: "Sistem Poin",     icon: <MdStars />,          component: <MemberPoints />   },
  { id: "benefit",  label: "Benefit & Voucher",icon: <MdCardGiftcard />, component: <MemberBenefit />  },
  { id: "database", label: "Database Member", icon: <MdPeople />,         component: <MemberDatabase /> },
  { id: "pos",      label: "Kasir / POS",     icon: <MdPointOfSale />,    component: <MemberPOS />      },
];

export default function Membership() {
  const [activeTab, setActiveTab] = useState("tier");

  const active   = membershipData.filter(m => m.status === "Active").length;
  const expiring = membershipData.filter(m => m.status === "Expiring").length;
  const expired  = membershipData.filter(m => m.status === "Expired").length;

  const current = TABS.find(t => t.id === activeTab);

  return (
    <div className="flex flex-col min-h-full">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-100 px-6 pt-5 pb-0">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Membership</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {membershipData.length} total member ·{" "}
              <span className="text-green-600 font-semibold">{active} aktif</span> ·{" "}
              <span className="text-orange-500 font-semibold">{expiring} expiring</span> ·{" "}
              <span className="text-red-500 font-semibold">{expired} expired</span>
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
              }`}>
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {current?.component}
      </div>
    </div>
  );
}
