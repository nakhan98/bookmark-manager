"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BookmarksClient() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ id: null, title: "", url: "", note: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("BOOKMARKS_TOKEN");
      if (!token) {
         window.location.href = "/login";
         return;
      }
      const res = await fetch("/api/multi/bookmarks", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setBookmarks(data);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
      setError("Failed to load bookmarks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.url) {
      setError("URL is required");
      return;
    }
    
    let url = formData.url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    
    try {
      const method = formData.id ? "PUT" : "POST";
      const token = localStorage.getItem("BOOKMARKS_TOKEN") || "";
      const res = await fetch("/api/multi/bookmarks", {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ...formData, url }),
      });
      
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Something went wrong");
      } else {
        setFormData({ id: null, title: "", url: "", note: "" });
        setIsFormVisible(false);
        fetchBookmarks();
      }
    } catch (err) {
      console.error("Error saving bookmark:", err);
      setError("Failed to save bookmark. Please try again.");
    }
  };

  const handleEdit = (bookmark) => {
    setFormData(bookmark);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;
    try {
      const token = localStorage.getItem("BOOKMARKS_TOKEN") || "";
      await fetch("/api/multi/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      fetchBookmarks();
    } catch (err) {
      console.error("Error deleting bookmark:", err);
      setError("Failed to delete bookmark. Please try again.");
    }
  };
  
  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {error ? (
        <div className="p-8">
          <p className="text-red-600">{error}</p>
          <a href="/login" className="text-blue-500 underline">Login</a>
        </div>
      ) : (
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Bookmark Manager
        </h1>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="btn btn-primary"
        >
          {isFormVisible ? "Cancel" : "Add Bookmark"}
        </button>
      </header>
      )}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          className="input pl-10"
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isFormVisible && (
        <div className="mb-8 p-6 card">
          <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Bookmark" : "Add New Bookmark"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title (optional)</label>
              <input
                type="text"
                id="title"
                name="title"
                className="input"
                placeholder="Website Title (auto-generated if empty)"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium mb-1">URL</label>
              <input
                type="text"
                id="url"
                name="url"
                className="input"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="note" className="block text-sm font-medium mb-1">Notes (optional)</label>
              <textarea
                id="note"
                name="note"
                rows={3}
                className="input"
                placeholder="Add notes about this bookmark..."
                value={formData.note || ""}
                onChange={handleInputChange}
              />
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => { setFormData({ id: null, title: "", url: "", note: "" }); setIsFormVisible(false); }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {formData.id ? "Update Bookmark" : "Save Bookmark"}
              </button>
            </div>
          </form>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No bookmarks found</h3>
          <p className="text-gray-600">
            {searchTerm ? "Try a different search term" : "Add your first bookmark to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="card p-4 flex flex-col">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-10 h-10 mr-3 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={(() => {
                      try {
                        const urlObj = new URL(bookmark.url);
                        return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
                      } catch (err) {
                        return "/globe.svg";
                      }
                    })()} 
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.src = "/globe.svg"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate">{bookmark.title}</h3>
                  <a 
                    href={bookmark.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline truncate block"
                  >
                    {bookmark.url}
                  </a>
                </div>
              </div>
              {bookmark.note && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {bookmark.note}
                </p>
              )}
              <div className="flex justify-end gap-2 mt-auto">
                <button 
                  onClick={() => handleEdit(bookmark)}
                  className="btn btn-secondary text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(bookmark.id)}
                  className="btn btn-danger text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
