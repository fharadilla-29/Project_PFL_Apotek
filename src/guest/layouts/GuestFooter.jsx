import { Link } from "react-router-dom";
import { RiMedicineBottleLine } from "react-icons/ri";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { BsInstagram, BsFacebook, BsTwitterX, BsWhatsapp } from "react-icons/bs";

export default function GuestFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-teal-600 rounded-lg p-1.5">
                <RiMedicineBottleLine className="text-white text-xl" />
              </div>
              <div>
                <p className="font-extrabold text-white text-base leading-none">Outlet Pharmacy</p>
                <p className="text-xs text-teal-400 leading-none mt-0.5">صيدلية أوتليت</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Authentic pharmacy, beauty and wellness products all in one trusted place.
            </p>
            <div className="flex gap-3">
              {[BsInstagram, BsFacebook, BsTwitterX, BsWhatsapp].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="text-sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2">
              {["About Us","Contact Us","Careers","Blog","Press"].map(l => (
                <li key={l}><Link to="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">Categories</h3>
            <ul className="space-y-2">
              {["Skin Care","Supplements","Baby Care","Personal Care","Hair Care","Beauty"].map(l => (
                <li key={l}><Link to="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">Contact Us</h3>
            <div className="space-y-3">
              {[
                { icon: <MdPhone />, text: "+62 812 3456 7890" },
                { icon: <MdEmail />, text: "hello@outletpharmacy.com" },
                { icon: <MdLocationOn />, text: "Jl. Sudirman No. 45, Jakarta" },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-teal-400 flex-shrink-0 mt-0.5">{c.icon}</span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2026 Outlet Pharmacy. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => (
              <Link key={l} to="#" className="text-xs text-gray-500 hover:text-teal-400 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
