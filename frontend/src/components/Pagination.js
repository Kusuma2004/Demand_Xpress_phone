import React from 'react';
export default function Pagination({page,total,limit,onChange}){
  const totalPages = Math.max(1, Math.ceil(total/limit));
  return (
    <div style={{display:'flex',gap:8,alignItems:'center'}}>
      <button disabled={page<=1} onClick={()=>onChange(page-1)}>Prev</button>
      <span>Page {page}/{totalPages}</span>
      <button disabled={page>=totalPages} onClick={()=>onChange(page+1)}>Next</button>
    </div>
  );
}
