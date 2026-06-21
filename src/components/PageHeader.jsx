export default function PageHeader({ title, breadcrumb, children }) {
    return (
        <div id="pageheader-container" className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
            <div id="pageheader-left" className="flex flex-col">
                <h1 id="page-title" className="text-3xl font-bold text-gray-900">
                    {title}
                </h1>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-1 text-sm">
                    <span className="text-gray-400">Dashboard</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-blue-500">
                        {Array.isArray(breadcrumb) ? breadcrumb.join(" / ") : breadcrumb}
                    </span>
                </div>
            </div>
            
            {/* Slot untuk tombol "Add Orders" atau "Add Customer" */}
            <div id="pageheader-actions">
                {children}
            </div>
        </div>
    );
}