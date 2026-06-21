import { useEffect, useState } from "react";
import { MdAdd, MdCheckCircle, MdError } from "react-icons/md";
import { notesAPI } from "../../services/notesAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import GenericTable from "../../components/GenericTable";

export default function Note() {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState("");
    const [success, setSuccess] = useState("");
    const [notes, setNotes]     = useState([]);
    const [dataForm, setDataForm] = useState({ title: "", content: "", status: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); setError(""); setSuccess("");
            await notesAPI.createNote(dataForm);
            setSuccess("Catatan berhasil ditambahkan!");
            setDataForm({ title: "", content: "", status: "" });
            setTimeout(() => setSuccess(""), 3000);
            loadNotes();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadNotes(); }, []);

    const loadNotes = async () => {
        try {
            setLoading(true); setError("");
            const data = await notesAPI.fetchNotes();
            setNotes(data);
        } catch (err) {
            setError("Gagal memuat catatan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl font-extrabold text-gray-900">Notes</h1>
                <p className="text-xs text-gray-400 mt-0.5">Kelola catatan dan pengingat apotek</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-800 mb-4">Tambah Catatan Baru</h3>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-lg p-3 mb-3">
                                <MdError /> {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-lg p-3 mb-3">
                                <MdCheckCircle /> {success}
                            </div>
                        )}

                        <form className="space-y-3" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Judul</label>
                                <input type="text" name="title" value={dataForm.title} onChange={handleChange} required disabled={loading}
                                    placeholder="Judul catatan"
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Catatan</label>
                                <textarea name="content" value={dataForm.content} onChange={handleChange} required rows="4" disabled={loading}
                                    placeholder="Tulis catatan di sini..."
                                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50 resize-none" />
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-sm transition-all">
                                <MdAdd className="text-base" />
                                {loading ? "Menyimpan..." : "Tambah Catatan"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <span className="text-sm font-bold text-gray-800">Daftar Catatan</span>
                            <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{notes.length}</span>
                        </div>

                        {loading && <div className="p-6"><LoadingSpinner text="Memuat catatan..." /></div>}

                        {!loading && notes.length === 0 && !error && (
                            <EmptyState text="Belum ada catatan. Tambah catatan pertama!" />
                        )}
                        {!loading && notes.length === 0 && error && (
                            <EmptyState text="Terjadi kesalahan. Coba lagi nanti." />
                        )}

                        {!loading && notes.length > 0 && (
                            <GenericTable
                                columns={["#", "Judul", "Isi Catatan"]}
                                data={notes}
                                renderRow={(note, index) => (
                                    <>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-500">{index + 1}.</td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-semibold text-teal-600">{note.title}</span>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <span className="text-sm text-gray-500 truncate block">{note.content}</span>
                                        </td>
                                    </>
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
