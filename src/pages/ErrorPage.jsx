import { Link } from "react-router-dom";

export default function ErrorPage({ code, title, description, image }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
            <img
                src={image || "https://illustrations.popsy.co/gray/status-code-404.svg"}
                alt="Error Illustration"
                className="w-64 mb-8 opacity-90"
            />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold mb-4">
                Error {code}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{title}</h1>
            <p className="text-gray-400 text-sm max-w-sm">{description}</p>
            <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition-all text-sm"
            >
                ← Kembali ke Dashboard
            </Link>
        </div>
    );
}
