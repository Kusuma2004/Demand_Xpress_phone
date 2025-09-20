import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../api";
import "./ContactForm.css"; // import the CSS

const emailRe = /^\S+@\S+\.\S+$/;
const phoneRe = /^\d{10}$/;

export default function ContactForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [err, setErr] = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const { name, email, phone } = form;
    if (!name || !emailRe.test(email) || !phoneRe.test(phone)) {
      setErr("⚠️ Enter valid name, email, and 10-digit phone");
      return;
    }
    setErr(null);
    try {
      const res = await API.post("/contacts", { name, email, phone });
      onAdd(res.data);
      setForm({ name: "", email: "", phone: "" });
    } catch (e) {
      setErr(e?.response?.data?.error || "❌ Failed to add contact");
    }
  };

  return (
    <div className="form-page">
      <motion.div
        className="form-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="form-title">➕ Add New Contact</h2>
        <form onSubmit={submit} className="form-grid">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="text"
            name="name"
            value={form.name}
            onChange={handle}
            placeholder="👤 Full Name"
            className="form-input"
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="email"
            name="email"
            value={form.email}
            onChange={handle}
            placeholder="📧 Email"
            className="form-input"
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="text"
            name="phone"
            value={form.phone}
            onChange={handle}
            placeholder="📱 Phone (10 digits)"
            className="form-input"
          />
          {err && <div className="error-msg">{err}</div>}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="form-btn"
          >
            Save Contact
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
