import React, { useState } from "react";

export default function ContactList({ contacts, onDelete }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");

  // Filter by search query
  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const current = filtered.slice(start, start + perPage);

  if (!contacts.length)
    return <div style={styles.emptyBox}>No contacts</div>;

  return (
    <div>
      {/* 🔍 Search */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="🔍 Search contacts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={styles.search}
        />
      </div>

      {/* 📋 Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {current.map((c) => (
              <tr
                key={c.id || c.ID}
                style={{ transition: "all 0.3s ease" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={styles.td}>{c.name}</td>
                <td style={styles.td}>{c.email}</td>
                <td style={styles.td}>{c.phone}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => onDelete(c.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan="4" style={styles.noResults}>
                  No results found 🔎
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ⏩ Pagination + Page Size */}
      <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          style={{ ...styles.pageBtn, opacity: page === 1 ? 0.5 : 1 }}
        >
          ⬅ Prev
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            style={{
              ...styles.pageBtn,
              background:
                page === i + 1
                  ? "linear-gradient(135deg, #ff758c, #ff7eb3)"
                  : styles.pageBtn.background,
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          style={{
            ...styles.pageBtn,
            opacity: page === totalPages || totalPages === 0 ? 0.5 : 1,
          }}
        >
          Next ➡
        </button>

        {/* Page size selector */}
        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
          style={styles.select}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>
    </div>
  );
}

const styles = {
  tableWrapper: {
    overflowX: "auto",
    marginTop: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    backdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#1d0410ff",
    fontSize: "1rem",
    borderRadius: "16px",
    overflow: "hidden",
  },
  theadRow: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  th: {
    padding: "14px 12px",
    textAlign: "left",
    fontWeight: "700",
    letterSpacing: "0.5px",
    color: "#100909ff",
  },
  td: {
    padding: "12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  deleteBtn: {
    background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "16px",
    gap: "8px",
    flexWrap: "wrap",
  },
  pageBtn: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  select: {
    background: "rgba(255,255,255,0.15)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  search: {
    width: "80%",
    maxWidth: "400px",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.15)",
    color: "#250324ff",
    fontSize: "1rem",
    outline: "none",
    backdropFilter: "blur(10px)",
  },
  noResults: {
    textAlign: "center",
    padding: "20px",
    fontStyle: "italic",
    color: "#111178ff",
  },
  emptyBox: {
    textAlign: "center",
    padding: "20px",
    fontSize: "1.2rem",
    color: "#fff",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.1)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },
};
