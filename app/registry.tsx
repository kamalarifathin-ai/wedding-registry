"use client";

import { FormEvent, useState } from "react";
import { rupiah } from "../lib/format";
import { ContributionInput, WishlistItem } from "../lib/types";

export default function Registry({ initialItems, demoMode }: { initialItems: WishlistItem[]; demoMode: boolean }) {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<WishlistItem | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function contribute(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const value = Number(amount);
    if (!name.trim() || !Number.isFinite(value) || value <= 0) return setMessage("Isi nama dan nominal yang valid terlebih dahulu.");
    setSubmitting(true);
    const payload: ContributionInput = { item_id: selected.id, contributor_name: name.trim(), amount: value };
    const response = await fetch("/api/contribute", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (response.ok) {
      setItems((current) => current.map((item) => item.id === selected.id ? { ...item, current_total: item.current_total + value, progress_percent: Math.round(((item.current_total + value) / item.target_price) * 1000) / 10 } : item));
      setMessage("Terima kasih! Setelah transfer, kontribusi kamu sudah tercatat.");
      setName(""); setAmount("");
    } else setMessage("Maaf, kontribusi belum dapat disimpan. Silakan coba lagi.");
    setSubmitting(false);
  }

  return <main>
    <section className="hero"><p className="eyebrow">THE WEDDING OF</p><h1>Afiya <span>&amp;</span> Fathin</h1><p>Terima kasih sudah ikut merayakan hari bahagia kami. Jika berkenan, yuk patungan untuk wishlist perabotan rumah pertama kami.</p></section>
    {demoMode && <p className="demo">Mode demo aktif — sambungkan Supabase saat data registry sudah siap.</p>}
    <section className="payment"><div className="qris"><img src="/qris.jpeg" alt="QRIS untuk patungan wedding registry" /></div><div><h2>Cara patungan</h2><p>1. Pilih wishlist dan isi nominal di formulir.</p><p>2. Transfer melalui QRIS atau rekening yang dicantumkan pengantin.</p><p>3. Pastikan nominal transfer sama dengan yang kamu isi di form, ya.</p></div></section>
    <div className="wishlist-heading"><p className="eyebrow">PILIH MAU IKUT PATUNGAN UNTUK BARANG APA HEHE</p><h2>Wishlist<br /><span>({items.length} barang)</span></h2></div>
    <section className="grid">{items.map((item) => { const percent = Math.min(item.progress_percent, 100); return <article className="card" key={item.id}>
      <div className="image">{item.photo_url ? <img src={item.photo_url} alt={item.name} /> : "🎁"}</div><h2>{item.name}</h2>{item.description && <p className="description">{item.description}</p>}
      <div className="track"><div className="bar" style={{ width: `${percent}%` }} /></div><p className="meta">Terkumpul <b>{rupiah(item.current_total)}</b> <span>({item.progress_percent}%)</span> dari harga <b>{rupiah(item.target_price)}</b></p>
      {item.progress_percent >= 100 && <p className="complete">🎉 Target terpenuhi!</p>}
      <button onClick={() => { setSelected(item); setMessage(""); }}>Ikut patungan</button>
    </article>; })}</section>
    {selected && <div className="overlay" onClick={() => setSelected(null)}><form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={contribute}><button className="close" type="button" onClick={() => setSelected(null)}>×</button><p className="eyebrow">PATUNGAN UNTUK</p><h2>{selected.name}</h2><label>Nama<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nama kamu" /></label><label>Nominal (Rp)<input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} required placeholder="Contoh: 100000" /></label><button disabled={submitting}>{submitting ? "Menyimpan..." : "Catat kontribusi"}</button>{message && <p className="message">{message}</p>}</form></div>}
  </main>;
}
