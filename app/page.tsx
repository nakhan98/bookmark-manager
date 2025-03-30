"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ id: null, title: "", url: "", note: "" });
  const [error, setError] = useState("");

  const fetchBookmarks = async () => {
    const res = await fetch("/api/bookmarks");
    const data = await res.json();
    setBookmarks(data);
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
    if (!formData.title || !formData.url) {
      setError("Title and URL are required");
      return;
    }
    let url = formData.url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }
    const method = formData.id ? "PUT" : "POST";
    const res = await fetch("/api/bookmarks", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, url }),
    });
    const result = await res.json();
    if (!res.ok) {
      setError(result.error);
    } else {
      setFormData({ id: null, title: "", url: "", note: "" });
      fetchBookmarks();
    }
  };

  const handleEdit = (bookmark) => {
    setFormData(bookmark);
  };

  const handleDelete = async (id) => {
    await fetch("/api/bookmarks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBookmarks();
  };

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem" }}>
      <h1>Bookmark Manager</h1>
      <input
        type="text"
        placeholder="Search bookmarks"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input
          type="url"
          name="url"
          placeholder="URL"
          value={formData.url}
          onChange={handleInputChange}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <textarea
          name="note"
          placeholder="Note"
          value={formData.note}
          onChange={handleInputChange}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" style={{ padding: "0.5rem", width: "100%" }}>
          {formData.id ? "Update Bookmark" : "Add Bookmark"}
        </button>
      </form>
      <div>
        {filteredBookmarks.map((b) => (
          <div
            key={b.id}
            style={{ border: "1px solid #ccc", padding: "0.5rem", marginBottom: "0.5rem" }}
          >
            <h3>{b.title}</h3>
            <p>{b.url}</p>
            <div>
              <button onClick={() => handleEdit(b)} style={{ marginRight: "0.5rem" }}>
                Edit
              </button>
              <button onClick={() => handleDelete(b.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
