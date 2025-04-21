"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ id: null, title: "", url: "", note: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookmarks");
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
      const res = await fetch("/api/bookmarks", {
        method,
        headers: { "Content-Type": "application/json" },
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
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) {
      return;
    }
    
    try {
      await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchBookmarks();
    } catch (err) {
      console.error("Error deleting bookmark:", err);
      setError("Failed to delete bookmark. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({ id: null, title: "", url: "", note: "" });
    setError("");
    setIsFormVisible(false);
  };

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.note && b.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get favicon from URL
  const getFavicon = (url) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return "/globe.svg";
    }
  };

"use client";
export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Personal Organiser</h1>
      <p className="text-lg mb-2">
        Manage your bookmarks, notes, calendar, photos and files seamlessly.
      </p>
      <p className="mb-2">
        Use the navigation bar above to explore different sections.
      </p>
      <p>
        Enjoy a secure and integrated experience for all your organisational needs.
      </p>
    </div>
  );
}
"use client";
export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Personal Organiser</h1>
      <p className="text-lg mb-2">Manage your bookmarks, notes, calendar, photos and files seamlessly.</p>
      <p className="mb-2">Use the navigation bar above to explore different sections.</p>
      <p>Enjoy a secure and integrated experience for all your organisational needs.</p>
    </div>
  );
}
"use client";
export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Personal Organiser</h1>
      <p className="text-lg mb-2">
        Manage your bookmarks, notes, calendar, photos and files seamlessly.
      </p>
      <p className="mb-2">
        Use the navigation bar above to explore different sections.
      </p>
      <p>
        Enjoy a secure and integrated experience for all your organisational needs.
      </p>
    </div>
  );
}
