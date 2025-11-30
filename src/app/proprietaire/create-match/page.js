"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listMyTerrains } from "../../../redux/actions/terrainActions";
import { createMatch } from "../../../redux/actions/matchActions";

import { useRouter } from "next/navigation";

export default function CreateMatchPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [terrainId, setTerrainId] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [niveau, setNiveau] = useState("Intermédiaire");
  const [prixParJoueur, setPrixParJoueur] = useState(20);

  // terrainsMine supposé rempli par listMyTerrains action (GET /api/terrains/mine)
  const terrainsMine = useSelector((state)=>state.terrainMine || { terrains: [] });
  const { terrains } = terrainsMine;

  useEffect(()=>{ dispatch(listMyTerrains()); }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createMatch({ terrainId, date, heure, niveau, prixParJoueur }, router));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={submitHandler} className="w-full max-w-xl bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Créer un match</h2>

        <div className="mb-4">
          <label className="block mb-1">Choisir le terrain</label>
          <select required value={terrainId} onChange={(e)=>setTerrainId(e.target.value)} className="w-full p-2 border rounded">
            <option value="">-- Sélectionner un de vos terrains --</option>
            {terrains.map(t=>(
              <option key={t._id} value={t._id}>{t.nom} — {t.ville}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="p-2 border rounded" />
          <input required type="time" value={heure} onChange={(e)=>setHeure(e.target.value)} className="p-2 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <select value={niveau} onChange={(e)=>setNiveau(e.target.value)} className="p-2 border rounded">
            <option>Débutant</option>
            <option>Intermédiaire</option>
            <option>Avancé</option>
          </select>
          <input type="number" value={prixParJoueur} onChange={(e)=>setPrixParJoueur(Number(e.target.value))} className="p-2 border rounded" />
        </div>

        <div className="mt-6">
          <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded">Créer le match</button>
        </div>
      </form>
    </div>
  );
}
