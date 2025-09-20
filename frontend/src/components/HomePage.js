import React, { useEffect, useState } from "react";
import API from "../api";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import Pagination from "./Pagination";

export default function HomePage() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const limit = 8;

  // Fetch contacts
  const fetchContacts = async (p = page) => {
    setLoading(true);
    try {
      const res = await API.get(`/contacts?page=${p}&limit=${limit}`);
      setContacts(res.data.contacts);
      setTotal(res.data.total);
      setPage(p);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (showContacts) fetchContacts(1);
  }, [showContacts]);

  // Handle Add Contact
  const handleAdd = (newContact) => {
    if (page === 1)
      setContacts((prev) => [newContact, ...prev].slice(0, limit));
    setTotal((t) => t + 1);
    setShowForm(false);
    setSuccessMsg("✅ Contact added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const prev = contacts;
    setContacts((c) => c.filter((x) => x.id !== id));
    try {
      await API.delete(`/contacts/${id}`);
      setTotal((t) => t - 1);
      if (contacts.length === 1 && page > 1) fetchContacts(page - 1);
    } catch (err) {
      setContacts(prev);
      alert("Delete failed!");
    }
  };

  return (
    <div className="home-container">
      <header className="hero">
        <h1>📒 Welcome to Contact Book</h1>
        <p>Manage your contacts easily with add, view, and delete options.</p>
        <div className="actions">
          <button
            className="btn"
            onClick={() => {
              setShowForm(true);
              setShowContacts(false);
            }}
          >
            ➕ Add Contact
          </button>
          <button
            className="btn"
            onClick={() => {
              setShowContacts(true);
              setShowForm(false);
            }}
          >
            👀 View Contacts
          </button>
        </div>
      </header>

      {/* Success message */}
      {successMsg && <div className="success">{successMsg}</div>}

      {/* Contact Form */}
      {showForm && (
        <section className="form-section">
          <h2 style={{
  fontSize: "1.8rem",
  fontWeight: "700",
  textAlign: "center",
  marginBottom: "20px",
  color: "white",
  letterSpacing: "1px",
  textShadow: "0 4px 10px rgba(0,0,0,0.4)",
  background: "linear-gradient(135deg, #3608a0ff, #8d0c68ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  Enter Contact Details
</h2>

          <ContactForm onAdd={handleAdd} />
        </section>
      )}

      {/* Contact List */}
      {showContacts && (
        <section className="list-section">
          <h2 style={{
  fontSize: "1.8rem",
  fontWeight: "700",
  textAlign: "center",
  marginBottom: "20px",
  color: "white",
  letterSpacing: "1px",
  textShadow: "0 4px 10px rgba(0,0,0,0.4)",
  background: "linear-gradient(135deg, #3608a0ff, #8d0c68ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
 Contact
</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <ContactList contacts={contacts} onDelete={handleDelete} />
          )}
          <Pagination
            page={page}
            total={total}
            limit={limit}
            onChange={(p) => fetchContacts(p)}
          />
        </section>
      )}
    </div>
  );
}
