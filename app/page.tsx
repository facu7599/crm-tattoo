"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// AUDITORÍA TÁCTICA: Asegurate de que estas variables en Vercel tengan los datos del POOLER que nos dio el VERDE.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  // Estados del Formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [instagramUser, setInstagramUser] = useState("");
  const [estiloInteres, setEstiloInteres] = useState("");
  const [idea, setIdea] = useState("");
  const [anotacionesClon, setAnotacionesClon] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [valorTotal, setValorTotal] = useState("");
  const [seniaPagada, setSeniaPagada] = useState("");
  const [botActivo, setBotActivo] = useState(true);

  // Estados de Gestión
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("todos");
  const [cargando, setCargando] = useState(false);

  // OBTENER CLIENTES (Dato Puro)
  const obtenerUsuarios = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("last_contact", { ascending: false });

    if (error) {
      console.error("ERROR SISTEMA:", error);
      return;
    }
    setUsuarios(data || []);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const guardar = async () => {
    if (!nombre || !email) {
      alert("Operador: Falta nombre o email. No se puede proceder.");
      return;
    }

    setCargando(true);
    const payload = {
      nombre,
      email,
      telefono,
      instagram_user: instagramUser || null,
      estilo_interes: estiloInteres || null,
      idea,
      anotaciones_clon: anotacionesClon || null,
      estado,
      valor_total: Number(valorTotal) || 0,
      senia_pagada: Number(seniaPagada) || 0,
      bot_activo: botActivo,
      last_contact: new Date().toISOString(),
    };

    try {
      if (editandoId) {
        const { error } = await supabase.from("usuarios").update(payload).eq("id", editandoId);
        if (error) throw error;
        alert("Cliente Actualizado - Sistema Optimizado");
        setEditandoId(null);
      } else {
        const { error } = await supabase.from("usuarios").insert([payload]);
        if (error) throw error;
        alert("Cliente Blindado en Base de Datos");
      }
      limpiarFormulario();
      obtenerUsuarios();
    } catch (error: any) {
      alert("FALLA TÁCTICA: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  const eliminarUsuario = async (id: string) => {
    if (!confirm("¿Eliminar registro? Esta acción es irreversible.")) return;
    const { error } = await supabase.from("usuarios").delete().eq("id", id);
    if (error) alert("Error al eliminar");
    obtenerUsuarios();
  };

  const editarUsuario = (u: any) => {
    setNombre(u.nombre || "");
    setEmail(u.email || "");
    setTelefono(u.telefono || "");
    setInstagramUser(u.instagram_user || "");
    setEstiloInteres(u.estilo_interes || "");
    setIdea(u.idea || "");
    setAnotacionesClon(u.anotaciones_clon || "");
    setEstado(u.estado || "pendiente");
    setValorTotal(String(u.valor_total ?? 0));
    setSeniaPagada(String(u.senia_pagada ?? 0));
    setBotActivo(Boolean(u.bot_activo));
    setEditandoId(u.id);
  };

  const limpiarFormulario = () => {
    setNombre(""); setEmail(""); setTelefono(""); setInstagramUser("");
    setEstiloInteres(""); setIdea(""); setAnotacionesClon("");
    setEstado("pendiente"); setValorTotal(""); setSeniaPagada("");
    setBotActivo(true); setEditandoId(null);
  };

  const irAWhatsapp = (u: any) => {
    if (!u.telefono) return;
    const tel = u.telefono.replace(/\D/g, "");
    const saldo = Number(u.valor_total || 0) - Number(u.senia_pagada || 0);
    const msj = Hola ${u.nombre}! Vi tu idea: "${u.idea || "tattoo"}". ¿Coordinamos? 🔥${saldo > 0 ? ` Resta un valor de $${saldo}. : ""}`;
    window.open(https://wa.me/${tel}?text=${encodeURIComponent(msj)}, "_blank");
  };

  const usuariosFiltrados = filtro === "todos" ? usuarios : usuarios.filter(u => u.estado === filtro);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f4f4f4", borderRadius: "10px" }}>
      <h1 style={{ textAlign: "center", color: "#1a1a1a" }}>DESTREZA MENTAL ARENA - CRM 🔴☀️</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} style={inputStyle} />
        <input placeholder="Instagram (@)" value={instagramUser} onChange={e => setInstagramUser(e.target.value)} style={inputStyle} />
        <input placeholder="Estilo" value={estiloInteres} onChange={e => setEstiloInteres(e.target.value)} style={inputStyle} />
        <input placeholder="Idea" value={idea} onChange={e => setIdea(e.target.value)} style={inputStyle} />
        <input placeholder="Valor Total ($)" type="number" value={valorTotal} onChange={e => setValorTotal(e.target.value)} style={inputStyle} />
        <input placeholder="Seña Pagada ($)" type="number" value={seniaPagada} onChange={e => setSeniaPagada(e.target.value)} style={inputStyle} />
        
        <select value={estado} onChange={e => setEstado(e.target.value)} style={{ ...inputStyle, gridColumn: "span 2" }}>
          <option value="pendiente">Pendiente</option>
          <option value="hablado">Hablado</option>
          <option value="senia">Con seña</option>
          <option value="confirmado">Confirmado</option>
        </select>

        <textarea placeholder="Memoria del Clon / Notas del Operador" value={anotacionesClon} onChange={e => setAnotacionesClon(e.target.value)} style={{ ...inputStyle, gridColumn: "span 2", minHeight: "100px" }} />

        <div style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="checkbox" checked={botActivo} onChange={e => setBotActivo(e.target.checked)} />
          <label><strong>MODO GUERRA: BOT ACTIVO</strong></label>
        </div>

        <button onClick={guardar} disabled={cargando} style={{ ...btnStyle, background: "#000", gridColumn: "span 2" }}>
          {editandoId ? "ACTUALIZAR DATOS" : "BLINDAR CLIENTE NUEVO"}
        </button>
      </div>

      <h3 style={{ marginTop: "40px" }}>LISTADO DE OPERACIONES</h3>
      <select onChange={e => setFiltro(e.target.value)} style={{ ...inputStyle, marginBottom: "20px" }}>
        <option value="todos">Todos los Estados</option>
        <option value="pendiente">Pendientes</option>
        <option value="hablado">Hablados</option>
        <option value="senia">Con seña</option>
        <option value="confirmado">Confirmados</option>
      </select>

      {usuariosFiltrados.map(u => (
        <div key={u.id} style={{ background: "white", padding: "15px", borderRadius: "8px", marginBottom: "15px", borderLeft: u.bot_activo ? "5px solid #4CAF50" : "5px solid #f44336" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{u.nombre}</strong>
            <span style={{ fontSize: "0.8em", color: "#666" }}>{new Date(u.last_contact).toLocaleDateString()}</span>
          </div>
          <p style={{ fontSize: "0.9em", margin: "5px 0" }}>{u.idea}</p>
          <div style={{ fontSize: "0.85em", color: "#555" }}>
            Saldo: <strong>${Number(u.valor_total || 0) - Number(u.senia_pagada || 0)}</strong> | Bot: {u.bot_activo ? "ON" : "OFF"}
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button onClick={() => irAWhatsapp(u)} style={smallBtn}>WS</button>
            <button onClick={() => editarUsuario(u)} style={smallBtn}>EDIT</button>
            <button onClick={() => eliminarUsuario(u.id)} style={{ ...smallBtn, color: "red" }}>ELIM</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "14px" };
const btnStyle = { padding: "15px", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" as "bold" };
const smallBtn = { padding: "5px 10px", cursor: "pointer", background: "none", border: "1px solid #ccc", borderRadius: "4px" }