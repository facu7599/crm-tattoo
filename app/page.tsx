"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [idea, setIdea] = useState("");
  const [senia, setSenia] = useState("");
  const [estado, setEstado] = useState("pendiente");

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("todos");

  const obtenerUsuarios = async () => {
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .order("created_at", { ascending: false });

    setUsuarios(data || []);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const guardar = async () => {
    if (!nombre || !email) {
      alert("Completá nombre y email");
      return;
    }

    if (editandoId) {
      await supabase
        .from("usuarios")
        .update({
          nombre,
          email,
          telefono,
          idea,
          senia,
          estado,
        })
        .eq("id", editandoId);

      setEditandoId(null);
    } else {
      await supabase.from("usuarios").insert([
        {
          nombre,
          email,
          telefono,
          idea,
          senia,
          estado,
        },
      ]);
    }

    limpiarFormulario();
    obtenerUsuarios();
  };

  const eliminarUsuario = async (id: string) => {
    await supabase.from("usuarios").delete().eq("id", id);
    obtenerUsuarios();
  };

  const editarUsuario = (u: any) => {
    setNombre(u.nombre);
    setEmail(u.email);
    setTelefono(u.telefono || "");
    setIdea(u.idea || "");
    setSenia(u.senia || "");
    setEstado(u.estado || "pendiente");
    setEditandoId(u.id);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setTelefono("");
    setIdea("");
    setSenia("");
    setEstado("pendiente");
    setEditandoId(null);
  };

  const irAWhatsapp = (u: any) => {
    if (!u.telefono) return;

    const mensaje =
      "Hola " +
      u.nombre +
      '! Vi tu idea: "' +
      (u.idea || "tattoo") +
      '". Te parece si coordinamos? 🔥';

    const url =
      "https://wa.me/" +
      u.telefono +
      "?text=" +
      encodeURIComponent(mensaje);

    window.open(url, "_blank");
  };

  const usuariosFiltrados =
    filtro === "todos"
      ? usuarios
      : usuarios.filter((u) => u.estado === filtro);

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>CRM Tattoo 🔥</h1>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="Idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="Seña"
        value={senia}
        onChange={(e) => setSenia(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      >
        <option value="pendiente">Pendiente</option>
        <option value="hablado">Hablado</option>
        <option value="senia">Con seña</option>
        <option value="confirmado">Confirmado</option>
      </select>

      <button
        onClick={guardar}
        style={{
          width: "100%",
          padding: 12,
          background: "black",
          color: "white",
          marginBottom: 20,
        }}
      >
        {editandoId ? "Actualizar" : "Guardar"}
      </button>

      <h3>Filtro</h3>

      <select
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      >
        <option value="todos">Todos</option>
        <option value="pendiente">Pendientes</option>
        <option value="hablado">Hablados</option>
        <option value="senia">Con seña</option>
        <option value="confirmado">Confirmados</option>
      </select>

      {usuariosFiltrados.map((u) => (
        <div
          key={u.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <div><strong>{u.nombre}</strong></div>
          <div>{u.email}</div>
          <div>{u.estado}</div>

          <button onClick={() => irAWhatsapp(u)}>WhatsApp</button>
          <button onClick={() => editarUsuario(u)}>Editar</button>
          <button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}