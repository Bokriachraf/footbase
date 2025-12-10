"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  listMyTerrains, 
  createTerrain 
} from "@/redux/actions/terrainActions";
import { 
  listMyMatchs, 
  createMatch, 
  updateMatch, 
  deleteMatch 
} from "@/redux/actions/matchActions";
import StadiumBackground from "@/components/StadiumBackground";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "react-toastify";
import Link from "next/link";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Users,
  Edit,
  Trash2,
  Eye,
  X,
  Check,
  ChevronDown,
  BarChart3,
  TrendingUp
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export default function ProprietairePage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // ---- REDUX ----
  const { terrains = [], loading: terrainsLoading } =
    useSelector((state) => state.terrainMine || {});

  const { matchs = [], loading: matchsLoading } =
    useSelector((state) => state.matchListMy || {});

  const { proprietaireInfo } =
    useSelector((state) => state.proprietaireSignin || {});

  // ---- LOCAL STATES ----
  const [search, setSearch] = useState("");
  const [filterTerrain, setFilterTerrain] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const [showCreateTerrain, setShowCreateTerrain] = useState(false);
  const [showCreateMatch, setShowCreateMatch] = useState(false);

  // terrain form
  const [newTerrainNom, setNewTerrainNom] = useState("");
  const [newTerrainVille, setNewTerrainVille] = useState("");
  const [newTerrainPrix, setNewTerrainPrix] = useState("");

  // match form
  const [newMatchTerrain, setNewMatchTerrain] = useState("");
  const [newMatchDate, setNewMatchDate] = useState("");
  const [newMatchHeure, setNewMatchHeure] = useState("");
  const [newMatchPrix, setNewMatchPrix] = useState("");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  // delete confirm
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // -----------------------------------------------
  // LOAD DATA
  // -----------------------------------------------
  useEffect(() => {
    dispatch(listMyTerrains());
    dispatch(listMyMatchs());
  }, [dispatch, id]);

  // -----------------------------------------------
  // FILTERING LOGIC
  // -----------------------------------------------
  const filteredMatchs = useMemo(() => {
    return matchs.filter((m) => {
      if (filterTerrain !== "all" && (m.terrain?._id || m.terrain) !== filterTerrain) return false;
      if (filterDate && !m.date?.startsWith(filterDate)) return false;

      if (!search) return true;

      const s = search.toLowerCase();
      return (
        (m.adversaire || "").toLowerCase().includes(s) ||
        (m.terrain?.nom || "").toLowerCase().includes(s) ||
        (m.terrain?.ville || "").toLowerCase().includes(s)
      );
    });
  }, [matchs, search, filterTerrain, filterDate]);

  // -----------------------------------------------
  // STATS
  // -----------------------------------------------
  const totalTerrains = terrains.length;
  const totalMatchs = filteredMatchs.length;

  const totalRevenus = filteredMatchs.reduce(
    (acc, m) => acc + Number(m.prixParJoueur ?? m.prix ?? 0),
    0
  );

  // -----------------------------------------------
  // CHARTS
  // -----------------------------------------------
  const revenuChart = {
    labels: filteredMatchs.slice(0, 7).map((m) => {
      const date = new Date(m.date);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }),
    datasets: [
      {
        label: "Revenus (DT)",
        data: filteredMatchs.slice(0, 7).map((m) => Number(m.prixParJoueur ?? m.prix ?? 0)),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        borderWidth: 3,
        fill: true,
      },
    ],
  };

  const occupationChart = {
    labels: terrains.slice(0, 5).map((t) => t.nom),
    datasets: [
      {
        label: "Matchs organisés",
        data: terrains.slice(0, 5).map((t) =>
          matchs.filter((m) => (m.terrain?._id || m.terrain) === t._id).length
        ),
        backgroundColor: "rgba(250, 204, 21, 0.7)",
        borderColor: "rgb(250, 204, 21)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      }
    }
  };

  // -----------------------------------------------
  // CREATE TERRAIN
  // -----------------------------------------------
  const handleCreateTerrain = async (e) => {
    e.preventDefault();
    if (!newTerrainNom) return toast.error("Nom du terrain requis");

    await dispatch(
      createTerrain({
        nom: newTerrainNom,
        ville: newTerrainVille,
        prixHeure: Number(newTerrainPrix || 0),
      })
    );

    toast.success("Terrain créé avec succès !");
    setNewTerrainNom("");
    setNewTerrainVille("");
    setNewTerrainPrix("");
    setShowCreateTerrain(false);
    
    dispatch(listMyTerrains());
  };

  // -----------------------------------------------
  // CREATE MATCH
  // -----------------------------------------------
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!newMatchTerrain || !newMatchDate || !newMatchHeure)
      return toast.error("Veuillez remplir tous les champs obligatoires");

    await dispatch(
      createMatch({
        terrainId: newMatchTerrain,
        date: newMatchDate,
        heure: newMatchHeure,
        prixParJoueur: Number(newMatchPrix || 0),
      })
    );

    toast.success("Match créé avec succès !");
    setNewMatchTerrain("");
    setNewMatchDate("");
    setNewMatchHeure("");
    setNewMatchPrix("");
    setShowCreateMatch(false);
    
    dispatch(listMyMatchs());
  };

  // -----------------------------------------------
  // OPEN EDIT MODAL
  // -----------------------------------------------
  const openEdit = (match) => {
    setEditingMatch({
      ...match,
      terrainId: match.terrain?._id || match.terrain,
      prixParJoueur: match.prixParJoueur ?? match.prix ?? 0,
    });
    setEditOpen(true);
  };

  // -----------------------------------------------
  // UPDATE MATCH
  // -----------------------------------------------
  const submitUpdate = async (e) => {
    e.preventDefault();
    await dispatch(
      updateMatch(editingMatch._id, {
        terrainId: editingMatch.terrainId,
        date: editingMatch.date,
        heure: editingMatch.heure,
        prixParJoueur: Number(editingMatch.prixParJoueur || 0),
        statut: editingMatch.statut,
      })
    );

    toast.success("Match mis à jour !");
    setEditOpen(false);
    dispatch(listMyMatchs());
  };

  // -----------------------------------------------
  // DELETE MATCH
  // -----------------------------------------------
  const doDelete = async () => {
    await dispatch(deleteMatch(confirmDeleteId));
    toast.success("Match supprimé !");
    setConfirmDeleteId(null);
    dispatch(listMyMatchs());
  };

  // ----------------------------------------------------
  // RENDER PAGE
  // ----------------------------------------------------
  return (
    <StadiumBackground>
      <div className="relative z-10 w-full max-w-7xl mx-auto py-6 px-3 md:py-8 md:px-4">
        
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-black mb-2 relative z-10"
            style={{
              background: "linear-gradient(135deg, #0f5c2f 0%, #1a7a3f 25%, #2d9c5a 40%, #facc15 50%, #2d9c5a 60%, #1a7a3f 75%, #0f5c2f 100%)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "brightness(1.1) contrast(1.2)",
              animation: "grassShimmer 4s ease-in-out infinite",
            }}
          >
            Espace Propriétaire
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <p className="text-white/80 text-sm md:text-base">
              Bonjour <span className="font-semibold text-yellow-300">{proprietaireInfo?.nom}</span>
              {" • "}
              <span className="font-mono text-green-300">ID: {id}</span>
            </p>
            
            {/* BOUTONS CRÉATION */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateMatch(!showCreateMatch)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm md:text-base flex items-center gap-2 transition-all duration-300 ${
                  showCreateMatch 
                    ? "bg-yellow-500/20 border border-yellow-500/50 text-yellow-300" 
                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
                }`}
              >
                <PlusCircle size={16} />
                {showCreateMatch ? "Fermer" : "Match"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateTerrain(!showCreateTerrain)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm md:text-base flex items-center gap-2 transition-all duration-300 ${
                  showCreateTerrain 
                    ? "bg-green-500/20 border border-green-500/50 text-green-300" 
                    : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                }`}
              >
                <PlusCircle size={16} />
                {showCreateTerrain ? "Fermer" : "Terrain"}
              </motion.button>
            </div>
          </div>
          
          {/* Ligne de séparation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-64 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 rounded-full mt-4"
          />
        </motion.header>

        {/* FORMULAIRES CRÉATION */}
        <AnimatePresence>
          {showCreateMatch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 md:p-6 border border-yellow-400/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-yellow-300 flex items-center gap-2">
                    <PlusCircle size={20} />
                    Nouveau Match
                  </h3>
                  <button
                    onClick={() => setShowCreateMatch(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-white/70" />
                  </button>
                </div>

                <form onSubmit={handleCreateMatch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Terrain</label>
                      <select
                        required
                        value={newMatchTerrain}
                        onChange={(e) => setNewMatchTerrain(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      >
                        <option value="" className="text-gray-400">Sélectionner un terrain</option>
                        {terrains.map((t) => (
                          <option key={t._id} value={t._id} className="text-black">
                            {t.nom} • {t.ville}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Date</label>
                      <input
                        type="date"
                        required
                        value={newMatchDate}
                        onChange={(e) => setNewMatchDate(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Heure</label>
                      <input
                        type="time"
                        required
                        value={newMatchHeure}
                        onChange={(e) => setNewMatchHeure(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Prix (DT)</label>
                      <input
                        type="number"
                        placeholder="Optionnel"
                        value={newMatchPrix}
                        onChange={(e) => setNewMatchPrix(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowCreateMatch(false)}
                      className="px-5 py-2 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
                    >
                      Créer le Match
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCreateTerrain && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 md:p-6 border border-green-400/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-green-300 flex items-center gap-2">
                    <PlusCircle size={20} />
                    Nouveau Terrain
                  </h3>
                  <button
                    onClick={() => setShowCreateTerrain(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-white/70" />
                  </button>
                </div>

                <form onSubmit={handleCreateTerrain} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Nom du terrain</label>
                      <input
                        required
                        value={newTerrainNom}
                        onChange={(e) => setNewTerrainNom(e.target.value)}
                        placeholder="Ex: Stade Olympique"
                        className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Ville</label>
                      <input
                        value={newTerrainVille}
                        onChange={(e) => setNewTerrainVille(e.target.value)}
                        placeholder="Ex: Tunis"
                        className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-sm mb-1 block">Prix / heure (DT)</label>
                      <input
                        type="number"
                        value={newTerrainPrix}
                        onChange={(e) => setNewTerrainPrix(e.target.value)}
                        placeholder="Ex: 50"
                        className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowCreateTerrain(false)}
                      className="px-5 py-2 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                    >
                      Créer le Terrain
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STATS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { 
              title: "Terrains", 
              value: terrainsLoading ? "..." : totalTerrains, 
              icon: <MapPin className="text-green-400" />, 
              color: "from-green-500/20 to-green-600/20",
              border: "border-green-400/20"
            },
            { 
              title: "Matchs", 
              value: matchsLoading ? "..." : totalMatchs, 
              icon: <Calendar className="text-blue-400" />, 
              color: "from-blue-500/20 to-blue-600/20",
              border: "border-blue-400/20"
            },
            { 
              title: "Revenus", 
              value: `${totalRevenus} DT`, 
              icon: <DollarSign className="text-yellow-400" />, 
              color: "from-yellow-500/20 to-yellow-600/20",
              border: "border-yellow-400/20"
            },
            { 
              title: "Disponible", 
              value: terrainsLoading ? "..." : terrains.filter(t => t.disponible !== false).length, 
              icon: <Check className="text-green-400" />, 
              color: "from-purple-500/20 to-purple-600/20",
              border: "border-purple-400/20"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className={`bg-gradient-to-br ${stat.color} backdrop-blur-lg border ${stat.border} rounded-2xl p-5 transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-white/70 text-sm font-medium">{stat.title}</div>
                <div className="p-2 bg-white/10 rounded-lg">{stat.icon}</div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* FILTERS - RESPONSIVE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          {/* Bouton pour afficher/masquer les filtres sur mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mb-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-yellow-400" />
              <span className="text-white font-medium">Filtres</span>
            </div>
            <ChevronDown 
              size={18} 
              className={`text-white/60 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Filtres (toujours visibles sur desktop, conditionnel sur mobile) */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block flex items-center gap-2">
                    <Search size={16} />
                    Recherche
                  </label>
                  <input
                    placeholder="Nom, adversaire, ville..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="text-white/80 text-sm mb-2 block flex items-center gap-2">
                    <MapPin size={16} />
                    Terrain
                  </label>
                  <select
                    value={filterTerrain}
                    onChange={(e) => setFilterTerrain(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="all" className="text-gray-400">Tous les terrains</option>
                    {terrains.map((t) => (
                      <option key={t._id} value={t._id} className="text-black">
                        {t.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white/80 text-sm mb-2 block flex items-center gap-2">
                    <Calendar size={16} />
                    Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CONTENU PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LISTE DES MATCHS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar size={20} />
                  Mes Matchs ({filteredMatchs.length})
                </h3>
                <div className="text-sm text-white/60">
                  {filteredMatchs.length === 0 ? "Aucun match" : `${filteredMatchs.length} résultat(s)`}
                </div>
              </div>

              {filteredMatchs.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-2">Aucun match trouvé</p>
                  <p className="text-white/40 text-sm">Essayez de modifier vos filtres</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredMatchs.map((match, index) => (
                    <motion.div
                      key={match._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-lg font-bold text-white truncate">
                              {match.adversaire || "Match sans nom"}
                            </div>
                            {match.statut && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                match.statut === 'terminé' ? 'bg-green-500/20 text-green-300' :
                                match.statut === 'annulé' ? 'bg-red-500/20 text-red-300' :
                                'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {match.statut}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {match.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {match.terrain?.nom || "Terrain inconnu"}
                            </div>
                            {match.prixParJoueur && (
                              <div className="flex items-center gap-1">
                                <DollarSign size={14} />
                                {match.prixParJoueur} DT
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link href={`/matchs/${match._id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                              title="Voir"
                            >
                              <Eye size={16} />
                            </motion.button>
                          </Link>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openEdit(match)}
                            className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setConfirmDeleteId(match._id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* CHARTS & TERRAINS */}
          <div className="space-y-6">
            {/* CHART REVENUS */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Évolution des revenus
              </h3>
              <div className="h-64">
                <Line data={revenuChart} options={chartOptions} />
              </div>
            </motion.div>

            {/* LISTE TERRAINS */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin size={20} />
                  Mes Terrains ({terrains.length})
                </h3>
                <button
                  onClick={() => setShowCreateTerrain(true)}
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                  title="Ajouter un terrain"
                >
                  <PlusCircle size={16} />
                </button>
              </div>

              {terrains.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">Aucun terrain créé</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {terrains.map((terrain, index) => (
                    <motion.div
                      key={terrain._id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate">{terrain.nom}</div>
                          <div className="text-sm text-white/60 flex items-center gap-1">
                            <MapPin size={12} />
                            {terrain.ville || "Ville non spécifiée"}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-yellow-300">
                          {terrain.prixHeure || 0} DT
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* MODAL ÉDITION MATCH */}
        <AnimatePresence>
          {editOpen && editingMatch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setEditOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-yellow-300">Modifier le match</h3>
                  <button
                    onClick={() => setEditOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-white/70" />
                  </button>
                </div>

                <form onSubmit={submitUpdate} className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Terrain</label>
                    <select
                      value={editingMatch.terrainId}
                      onChange={(e) =>
                        setEditingMatch({ ...editingMatch, terrainId: e.target.value })
                      }
                      className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                      required
                    >
                      {terrains.map((t) => (
                        <option key={t._id} value={t._id} className="text-black">
                          {t.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/80 text-sm mb-2 block">Date</label>
                      <input
                        type="date"
                        value={editingMatch.date}
                        onChange={(e) =>
                          setEditingMatch({ ...editingMatch, date: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-white/80 text-sm mb-2 block">Heure</label>
                      <input
                        type="time"
                        value={editingMatch.heure}
                        onChange={(e) =>
                          setEditingMatch({ ...editingMatch, heure: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Prix par joueur (DT)</label>
                    <input
                      type="number"
                      value={editingMatch.prixParJoueur}
                      onChange={(e) =>
                        setEditingMatch({
                          ...editingMatch,
                          prixParJoueur: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Statut</label>
                    <select
                      value={editingMatch.statut || ""}
                      onChange={(e) =>
                        setEditingMatch({ ...editingMatch, statut: e.target.value })
                      }
                      className="w-full p-3 rounded-xl bg-white/5 text-white border border-white/20 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="" className="text-gray-400">Sélectionner un statut</option>
                      <option value="programmé" className="text-black">Programmé</option>
                      <option value="terminé" className="text-black">Terminé</option>
                      <option value="annulé" className="text-black">Annulé</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setEditOpen(false)}
                      className="px-5 py-2 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
                    >
                      Enregistrer
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL CONFIRMATION SUPPRESSION */}
        <AnimatePresence>
          {confirmDeleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setConfirmDeleteId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} className="text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Confirmer la suppression</h3>
                  <p className="text-white/60">
                    Cette action est irréversible. Voulez-vous vraiment supprimer ce match ?
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmDeleteId(null)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={doDelete}
                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
                  >
                    Supprimer
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Styles pour les animations */}
        <style jsx>{`
          @keyframes grassShimmer {
            0%, 100% { 
              background-position: 0% 50%;
              filter: brightness(1.1) contrast(1.2);
            }
            50% { 
              background-position: 100% 50%;
              filter: brightness(1.3) contrast(1.4);
            }
          }
          
          /* Scrollbar personnalisée */
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    </StadiumBackground>
  );
}



// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { listMyTerrains, createTerrain } from "@/redux/actions/terrainActions";
// import { listMyMatchs, createMatch, updateMatch, deleteMatch } from "@/redux/actions/matchActions";
// import StadiumBackground from "@/components/StadiumBackground";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { toast } from "react-toastify";
// import Link from "next/link";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend
// );

// export default function ProprietairePage({ params }) {
//   const { id } = React.use(params);
//   const dispatch = useDispatch();

//   // Redux slices
//   const terrainMine = useSelector((state) => state.terrainMine || {});
//   const { terrains = [], loading: terrainsLoading, error: terrainsError } = terrainMine;

//   const matchListMy = useSelector((state) => state.matchListMy || {});
//   const { matchs = [], loading: matchsLoading, error: matchsError } = matchListMy;

//   const proprietaireSignin = useSelector((state) => state.proprietaireSignin || {});
//   const { proprietaireInfo } = proprietaireSignin || {};

//   // local UI states (filters + forms)
//   const [search, setSearch] = useState("");
//   const [filterTerrain, setFilterTerrain] = useState("all");
//   const [filterDate, setFilterDate] = useState("");

//   // create forms visibility (collapsible)
//   const [showCreateTerrain, setShowCreateTerrain] = useState(false);
//   const [showCreateMatch, setShowCreateMatch] = useState(false);

//   // form : terrain
//   const [newTerrainNom, setNewTerrainNom] = useState("");
//   const [newTerrainVille, setNewTerrainVille] = useState("");
//   const [newTerrainPrix, setNewTerrainPrix] = useState("");

//   // form : match
//   const [newMatchTerrain, setNewMatchTerrain] = useState("");
//   const [newMatchDate, setNewMatchDate] = useState("");
//   const [newMatchHeure, setNewMatchHeure] = useState("");
//   const [newMatchPrix, setNewMatchPrix] = useState("");

//   // edit modal state
//   const [editOpen, setEditOpen] = useState(false);
//   const [editingMatch, setEditingMatch] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [updateLoading, setUpdateLoading] = useState(false);

//   // load data
//   useEffect(() => {
//     dispatch(listMyTerrains());
//     dispatch(listMyMatchs());
//   }, [dispatch, id]);

//   // filtering
//   const filteredMatchs = useMemo(() => {
//     return matchs.filter((m) => {
//       const terrainName = m.terrain?.nom || (m.terrain ? m.terrain.toString() : "");
//       if (filterTerrain !== "all" && (m.terrain?._id || m.terrain) !== filterTerrain) return false;
//       if (filterDate && !m.date?.startsWith(filterDate)) return false;
//       if (!search) return true;
//       const s = search.toLowerCase();
//       return (
//         (m.adversaire || "").toLowerCase().includes(s) ||
//         terrainName.toLowerCase().includes(s) ||
//         (m.terrain?.ville || "").toLowerCase().includes(s)
//       );
//     });
//   }, [matchs, search, filterTerrain, filterDate]);

//   // stats & charts (same as avant)
//   const totalTerrains = terrains.length;
//   const totalMatchs = filteredMatchs.length;
//   const totalRevenus = filteredMatchs.reduce((acc, m) => acc + (Number(m.prixParJoueur ?? m.prix ?? 0)), 0);

//   const revenuChart = useMemo(() => {
//     const labels = filteredMatchs.map((m) => m.date || m._id);
//     const data = filteredMatchs.map((m) => Number(m.prixParJoueur ?? m.prix ?? 0));
//     return { labels, datasets: [{ label: "Revenus (par match)", data, fill: false, tension: 0.2 }] };
//   }, [filteredMatchs]);

//   const occupationChart = useMemo(() => {
//     const labels = terrains.map((t) => t.nom || t._id);
//     const data = terrains.map((t) =>
//       matchs.filter((m) => {
//         const tid = m.terrain?._id || m.terrain;
//         return tid && tid.toString() === (t._id ? t._id.toString() : t.toString());
//       }).length
//     );
//     return { labels, datasets: [{ label: "Nombre de matchs", data }] };
//   }, [terrains, matchs]);

//   // create handlers
//   const handleCreateTerrain = async (e) => {
//     e.preventDefault();
//     if (!newTerrainNom) return toast.error("Nom du terrain requis");
//     await dispatch(createTerrain({ nom: newTerrainNom, ville: newTerrainVille, prixHeure: Number(newTerrainPrix || 0) }));
//     toast.success("Terrain créé");
//     setNewTerrainNom(""); setNewTerrainVille(""); setNewTerrainPrix("");
//     dispatch(listMyTerrains());
//   };

//   const handleCreateMatch = async (e) => {
//     e.preventDefault();
//     if (!newMatchTerrain || !newMatchDate || !newMatchHeure) return toast.error("Compléter tous les champs du match");
//     await dispatch(createMatch({ terrainId: newMatchTerrain, date: newMatchDate, heure: newMatchHeure, prixParJoueur: Number(newMatchPrix || 0) }));
//     toast.success("Match créé");
//     setNewMatchTerrain(""); setNewMatchDate(""); setNewMatchHeure(""); setNewMatchPrix("");
//     dispatch(listMyMatchs());
//   };

//   // open edit modal
//   const openEdit = (match) => {
//     setEditingMatch({
//       ...match,
//       terrainId: match.terrain?._id || match.terrain,
//       date: match.date || "",
//       heure: match.heure || "",
//       prixParJoueur: match.prixParJoueur ?? match.prix ?? 0,
//       // niveau: match.niveau || "",
//       statut: match.statut || "",
//     });
//     setEditOpen(true);
//   };

//   // submit update
//   const submitUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingMatch) return;
//     try {
//       setUpdateLoading(true);
//       await dispatch(updateMatch(editingMatch._id, {
//         terrainId: editingMatch.terrainId,
//         date: editingMatch.date,
//         heure: editingMatch.heure,
//         prixParJoueur: Number(editingMatch.prixParJoueur || 0),
//         // niveau: editingMatch.niveau,
//         statut: editingMatch.statut,
//       }));
//       toast.success("Match mis à jour");
//       dispatch(listMyMatchs());
//       setEditOpen(false);
//       setEditingMatch(null);
//     } catch (err) {
//       toast.error("Erreur mise à jour");
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // confirm delete
//   const confirmDelete = (id) => {
//     setConfirmDeleteId(id);
//   };

//   const doDelete = async () => {
//     if (!confirmDeleteId) return;
//     try {
//       setDeleteLoading(true);
//       await dispatch(deleteMatch(confirmDeleteId));
//       toast.success("Match supprimé");
//       dispatch(listMyMatchs());
//       setConfirmDeleteId(null);
//     } catch (err) {
//       toast.error("Erreur suppression");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   return (
//     <StadiumBackground rotateOnMobile>
//       <div className="w-full max-w-6xl mx-auto py-8 px-4">
//         <header className="mb-6">
//           <h1 className="text-4xl font-extrabold text-yellow-400">Espace Propriétaire</h1>
//           <p className="text-white/80 mt-1">
//             Bonjour <span className="font-semibold">{proprietaireInfo?.nom || "Propriétaire"}</span> — id <span className="font-mono">{id}</span>
//           </p>
//         </header>

//         {/* CREATE toggles (collapsed by default) */}
//         <div className="flex gap-3 mb-6">
//           <button
//             onClick={() => setShowCreateMatch((s) => !s)}
//             className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold shadow"
//           >
//             {showCreateMatch ? "Fermer — Créer match" : "Créer match"}
//           </button>

//           <button
//             onClick={() => setShowCreateTerrain((s) => !s)}
//             className="px-4 py-2 rounded bg-green-500 text-black font-semibold shadow"
//           >
//             {showCreateTerrain ? "Fermer — Créer terrain" : "Créer terrain"}
//           </button>
//         </div>

//         {/* Collapsible forms appear here */}
//         <div className="space-y-4 mb-6">
//           {showCreateMatch && (
//             <div className="bg-black/60 p-4 rounded-2xl backdrop-blur-md border border-yellow-400/20">
//               <h3 className="text-yellow-300 font-semibold mb-3">Créer un match</h3>
//               <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
//                 <select required value={newMatchTerrain} onChange={(e)=>setNewMatchTerrain(e.target.value)} className="p-2 rounded bg-black/30 text-white">
//                   <option value="">Sélectionner un terrain</option>
//                   {terrains.map(t=> <option key={t._id} value={t._id}>{t.nom}</option>)}
//                 </select>
//                 <input required type="date" value={newMatchDate} onChange={(e)=>setNewMatchDate(e.target.value)} className="p-2 rounded bg-black/30 text-white"/>
//                 <input required type="time" value={newMatchHeure} onChange={(e)=>setNewMatchHeure(e.target.value)} className="p-2 rounded bg-black/30 text-white"/>
//                 <input type="number" placeholder="Prix par joueur (DT)" value={newMatchPrix} onChange={(e)=>setNewMatchPrix(e.target.value)} className="p-2 rounded bg-black/30 text-white"/>
//                 <div className="md:col-span-4 flex gap-2 justify-end">
//                   <button type="submit" className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold">Créer</button>
//                   <button type="button" onClick={()=>setShowCreateMatch(false)} className="px-4 py-2 rounded bg-gray-700 text-white">Annuler</button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {showCreateTerrain && (
//             <div className="bg-black/60 p-4 rounded-2xl backdrop-blur-md border border-green-400/20">
//               <h3 className="text-green-300 font-semibold mb-3">Ajouter un terrain</h3>
//               <form onSubmit={handleCreateTerrain} className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 <input required value={newTerrainNom} onChange={(e)=>setNewTerrainNom(e.target.value)} placeholder="Nom du terrain" className="p-2 rounded bg-black/30 text-white"/>
//                 <input value={newTerrainVille} onChange={(e)=>setNewTerrainVille(e.target.value)} placeholder="Ville" className="p-2 rounded bg-black/30 text-white"/>
//                 <input type="number" value={newTerrainPrix} onChange={(e)=>setNewTerrainPrix(e.target.value)} placeholder="Prix / heure" className="p-2 rounded bg-black/30 text-white"/>
//                 <div className="md:col-span-3 flex gap-2 justify-end">
//                   <button type="submit" className="px-4 py-2 rounded bg-green-400 text-black font-semibold">Créer terrain</button>
//                   <button type="button" onClick={()=>setShowCreateTerrain(false)} className="px-4 py-2 rounded bg-gray-700 text-white">Annuler</button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>

//         {/* STAT CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-black/60 p-5 rounded-2xl border border-yellow-400/10">
//             <div className="text-sm text-yellow-200">Terrains</div>
//             <div className="text-3xl font-bold text-white mt-2">{terrainsLoading ? "..." : totalTerrains}</div>
//             <div className="text-xs text-white/50 mt-1">Terrains liés</div>
//           </div>
//           <div className="bg-black/60 p-5 rounded-2xl border border-yellow-400/10">
//             <div className="text-sm text-yellow-200">Matchs (filtrés)</div>
//             <div className="text-3xl font-bold text-white mt-2">{matchsLoading ? "..." : totalMatchs}</div>
//             <div className="text-xs text-white/50 mt-1">Matchs organisés</div>
//           </div>
//           <div className="bg-black/60 p-5 rounded-2xl border border-yellow-400/10">
//             <div className="text-sm text-yellow-200">Revenus estimés</div>
//             <div className="text-3xl font-bold text-white mt-2">{totalRevenus} DT</div>
//             <div className="text-xs text-white/50 mt-1">Somme (matchs filtrés)</div>
//           </div>
//         </div>

//         {/* FILTERS */}
//         <div className="flex flex-col md:flex-row gap-3 items-center mb-6">
//           <input placeholder="Recherche (adversaire / terrain / ville...)" className="flex-1 p-3 rounded bg-black/30 text-white" value={search} onChange={(e)=>setSearch(e.target.value)}/>
//           <select className="p-3 rounded bg-black/30 text-white" value={filterTerrain} onChange={(e)=>setFilterTerrain(e.target.value)}>
//             <option value="all">Tous les terrains</option>
//             {terrains.map(t=> <option key={t._id} value={t._id}>{t.nom}</option>)}
//           </select>
//           <input type="date" className="p-3 rounded bg-black/30 text-white" value={filterDate} onChange={(e)=>setFilterDate(e.target.value)}/>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-black/60 p-4 rounded-2xl border border-yellow-400/10">
//               <h3 className="text-yellow-300 font-semibold mb-3">Liste des matchs (filtrés)</h3>
//               {filteredMatchs.length === 0 ? (
//                 <p className="text-white/60">Aucun match trouvé</p>
//               ) : (
//                 <ul className="space-y-2">
//                   {filteredMatchs.map(m => (
//                     <li key={m._id} className="p-3 bg-black/40 rounded flex justify-between items-center">
//                       <div>
//                         <div className="font-semibold text-white">{m.adversaire || "Match"}</div>
//                         <div className="text-xs text-white/60">{m.date} {m.heure ? `• ${m.heure}` : ""} — {m.terrain?.nom || m.terrain}</div>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <Link href={`/matchs/${m._id}`}>
//                           <button className="px-3 py-1 rounded bg-yellow-400 text-black">Voir</button>
//                         </Link>

//                         <button onClick={()=>openEdit(m)} className="px-3 py-1 rounded bg-green-500 text-black">Modifier</button>
//                         <button onClick={()=>confirmDelete(m._id)} className="px-3 py-1 rounded bg-red-600 text-white">Supprimer</button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           {/* Charts + list */}
//           <div className="space-y-6">
//             <div className="bg-black/60 p-4 rounded-2xl border border-yellow-400/10">
//               <h3 className="text-yellow-300 font-semibold mb-3">Revenus (par match)</h3>
//               <Line data={revenuChart} />
//             </div>

//             <div className="bg-black/60 p-4 rounded-2xl border border-yellow-400/10">
//               <h3 className="text-yellow-300 font-semibold mb-3">Occupation par terrain</h3>
//               <Bar data={occupationChart} />
//             </div>

            
//           </div>

//           {/* Right: terrains + create form etc. */}
//           <div className="space-y-6">
//             <div className="bg-black/60 p-4 rounded-2xl border border-green-400/10">
//               <h3 className="text-green-300 font-semibold mb-3">Mes Terrains</h3>
//               {terrains.length === 0 ? <p className="text-white/60">Aucun terrain</p> : (
//                 <ul className="space-y-2">
//                   {terrains.map(t => (
//                     <li key={t._id} className="p-3 bg-black/40 rounded flex justify-between items-center">
//                       <div>
//                         <div className="font-semibold text-white">{t.nom}</div>
//                         <div className="text-xs text-white/60">{t.ville || "Ville"}</div>
//                       </div>
//                       <div className="text-white">{t.prixHeure ?? 0} DT</div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* forms are available above as collapsible; keep extra spacing or help text */}
//             <div className="bg-black/60 p-4 rounded-2xl border border-yellow-400/10 text-white/70">
//               Astuce : utilise les boutons "Créer match" / "Créer terrain" pour ouvrir le formulaire. Tu peux modifier / supprimer un match depuis la liste.
//             </div>
//           </div>
//         </div>

//         {/* Edit modal (simple) */}
//         {editOpen && editingMatch && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center">
//             <div className="absolute inset-0 bg-black/70" onClick={() => { setEditOpen(false); setEditingMatch(null); }} />
//             <div className="relative z-60 w-full max-w-2xl p-6 rounded-2xl bg-black/80 border border-yellow-400/20">
//               <h3 className="text-yellow-300 font-semibold mb-3">Modifier le match</h3>
//               <form onSubmit={submitUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 <select className="p-2 rounded bg-black/30 text-white" value={editingMatch.terrainId} onChange={(e)=>setEditingMatch({...editingMatch, terrainId: e.target.value})}>
//                   <option value="">Sélectionner un terrain</option>
//                   {terrains.map(t => <option key={t._id} value={t._id}>{t.nom}</option>)}
//                 </select>
//                 <input className="p-2 rounded bg-black/30 text-white" value={editingMatch.date} onChange={(e)=>setEditingMatch({...editingMatch, date: e.target.value})} type="date" />
//                 <input className="p-2 rounded bg-black/30 text-white" value={editingMatch.heure} onChange={(e)=>setEditingMatch({...editingMatch, heure: e.target.value})} type="time" />
//                 <input className="p-2 rounded bg-black/30 text-white" value={editingMatch.prixParJoueur} onChange={(e)=>setEditingMatch({...editingMatch, prixParJoueur: e.target.value})} type="number" placeholder="Prix par joueur" />
//                 <select className="p-2 rounded bg-black/30 text-white" value={editingMatch.statut} onChange={(e)=>setEditingMatch({...editingMatch, statut: e.target.value})}>
//                   <option value="">Statut</option>
//                   <option>Ouvert</option><option>Complet</option><option>Terminé</option>
//                 </select>

//                 <div className="md:col-span-2 flex justify-end gap-2">
//                   <button type="submit" disabled={updateLoading} className="px-4 py-2 rounded bg-yellow-400 text-black">{updateLoading ? "En cours..." : "Enregistrer"}</button>
//                   <button type="button" onClick={()=>{ setEditOpen(false); setEditingMatch(null); }} className="px-4 py-2 rounded bg-gray-700 text-white">Fermer</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Delete confirmation */}
//         {confirmDeleteId && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center">
//             <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmDeleteId(null)} />
//             <div className="relative z-60 w-full max-w-md p-6 rounded-2xl bg-black/80 border border-red-600/30 text-white">
//               <h4 className="text-lg font-semibold mb-3">Confirmer la suppression</h4>
//               <p className="mb-4">Voulez-vous vraiment supprimer ce match ? Cette action est irréversible.</p>
//               <div className="flex justify-end gap-2">
//                 <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 rounded bg-gray-700">Annuler</button>
//                 <button onClick={doDelete} disabled={deleteLoading} className="px-4 py-2 rounded bg-red-600 text-white">{deleteLoading ? "Suppression..." : "Supprimer"}</button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* errors */}
//         {(terrainsError || matchsError) && (
//           <div className="mt-6 p-4 rounded bg-red-700/40 text-yellow-200">
//             Erreur : {terrainsError || matchsError}
//           </div>
//         )}
//       </div>
//     </StadiumBackground>
//   );
// }



// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { listMyTerrains, createTerrain } from "@/redux/actions/terrainActions";
// import { listMyMatchs, createMatch } from "@/redux/actions/matchActions";
// import StadiumBackground from "@/components/StadiumBackground";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend
// );

// export default function ProprietairePage({ params }) {
//   // Next.js app-router pattern used in ton projet
//   const { id } = React.use(params);

//   const dispatch = useDispatch();

//   // Redux slices
//   const terrainMine = useSelector((state) => state.terrainMine || {});
//   const { terrains = [], loading: terrainsLoading, error: terrainsError } = terrainMine;

//   const matchListMy = useSelector((state) => state.matchListMy || {});
//   const { matchs = [], loading: matchsLoading, error: matchsError } = matchListMy;

//   const proprietaireSignin = useSelector((state) => state.proprietaireSignin || {});
//   const { proprietaireInfo } = proprietaireSignin || {};

//   // UI / filters / forms
//   const [search, setSearch] = useState("");
//   const [filterTerrain, setFilterTerrain] = useState("all");
//   const [filterDate, setFilterDate] = useState("");

//   // Accordéons / collapse
//   const [openTerrainForm, setOpenTerrainForm] = useState(false);
//   const [openMatchForm, setOpenMatchForm] = useState(false);
//   const [openMatchList, setOpenMatchList] = useState(true); // <-- le match list est ouvrable

//   // Form state: terrain
//   const [newTerrainNom, setNewTerrainNom] = useState("");
//   const [newTerrainVille, setNewTerrainVille] = useState("");
//   const [newTerrainPrix, setNewTerrainPrix] = useState("");

//   // Form state: match
//   const [newMatchTerrain, setNewMatchTerrain] = useState("");
//   const [newMatchDate, setNewMatchDate] = useState("");
//   const [newMatchHeure, setNewMatchHeure] = useState("");
//   const [newMatchPrix, setNewMatchPrix] = useState("");

//   // Load owner's terrains + matchs
//   useEffect(() => {
//     dispatch(listMyTerrains());
//     dispatch(listMyMatchs());
//   }, [dispatch, id]);

//   // Filtered matches memoized
//   const filteredMatchs = useMemo(() => {
//     return matchs.filter((m) => {
//       const terrainName = m.terrain?.nom || "";
//       if (filterTerrain !== "all") {
//         const tid = m.terrain?._id || m.terrain;
//         if (!tid || tid.toString() !== filterTerrain.toString()) return false;
//       }
//       if (filterDate && !m.date?.startsWith(filterDate)) return false;
//       if (!search) return true;
//       const s = search.toLowerCase();
//       return (
//         (m.adversaire || "").toLowerCase().includes(s) ||
//         terrainName.toLowerCase().includes(s) ||
//         (m.terrain?.ville || "").toLowerCase().includes(s)
//       );
//     });
//   }, [matchs, search, filterTerrain, filterDate]);

//   // Stats
//   const totalTerrains = terrains.length;
//   const totalMatchs = filteredMatchs.length;
//   const totalRevenus = filteredMatchs.reduce((acc, m) => acc + (Number(m.prixParJoueur ?? m.prix ?? 0)), 0);

//   // Charts data
//   const revenuChart = useMemo(() => ({
//     labels: filteredMatchs.map((m) => m.date || m._id),
//     datasets: [
//       {
//         label: "Revenus (DT)",
//         data: filteredMatchs.map((m) => Number(m.prixParJoueur ?? m.prix ?? 0)),
//         borderColor: "#FACC15", // yellow
//         backgroundColor: "rgba(250,204,21,0.18)",
//         tension: 0.25,
//       },
//     ],
//   }), [filteredMatchs]);

//   const occupationChart = useMemo(() => ({
//     labels: terrains.map((t) => t.nom || t._id),
//     datasets: [
//       {
//         label: "Nombre de matchs",
//         data: terrains.map((t) =>
//           matchs.filter((m) => {
//             const tid = m.terrain?._id || m.terrain;
//             return tid && tid.toString() === (t._id ? t._id.toString() : t.toString());
//           }).length
//         ),
//         backgroundColor: "rgba(250,204,21,0.22)",
//         borderColor: "#FACC15",
//       },
//     ],
//   }), [terrains, matchs]);

//   // Handlers create
//   const handleCreateTerrain = async (e) => {
//     e.preventDefault();
//     if (!newTerrainNom) return alert("Nom du terrain requis");
//     await dispatch(createTerrain({
//       nom: newTerrainNom,
//       ville: newTerrainVille,
//       prixHeure: newTerrainPrix ? Number(newTerrainPrix) : 0,
//     }));
//     setNewTerrainNom("");
//     setNewTerrainVille("");
//     setNewTerrainPrix("");
//     dispatch(listMyTerrains());
//   };

//   const handleCreateMatch = async (e) => {
//     e.preventDefault();
//     if (!newMatchTerrain || !newMatchDate || !newMatchHeure) return alert("Compléter tous les champs du match");
//     await dispatch(createMatch({
//       terrainId: newMatchTerrain,
//       date: newMatchDate,
//       heure: newMatchHeure,
//       prixParJoueur: newMatchPrix ? Number(newMatchPrix) : 0,
//     }));
//     setNewMatchTerrain("");
//     setNewMatchDate("");
//     setNewMatchHeure("");
//     setNewMatchPrix("");
//     dispatch(listMyMatchs());
//   };

//   return (
//     <StadiumBackground rotateOnMobile={true}>
//       {/* overlay sombre pour contraste */}
//       <div className="absolute inset-0 bg-black/65 backdrop-blur-sm pointer-events-none" />

//       <div className="relative max-w-6xl mx-auto py-10 px-4">
//         {/* Header */}
//         <header className="mb-8">
//           <h1 className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg">Espace Propriétaire</h1>
//           <p className="mt-1 text-yellow-100/80">
//             Bonjour <span className="font-semibold text-white">{proprietaireInfo?.nom || "Propriétaire"}</span>
//             <span className="ml-3 text-sm font-mono text-green-300">ID: {id}</span>
//           </p>
//         </header>

//         {/* Stat cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-white/6 backdrop-blur-xl p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//             <div className="text-sm text-yellow-200/80">Terrains</div>
//             <div className="text-3xl font-bold text-yellow-300 mt-2">{terrainsLoading ? "..." : totalTerrains}</div>
//             <div className="text-xs text-yellow-100/60 mt-1">Terrains liés</div>
//           </div>

//           <div className="bg-white/6 backdrop-blur-xl p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//             <div className="text-sm text-yellow-200/80">Matchs (filtrés)</div>
//             <div className="text-3xl font-bold text-yellow-300 mt-2">{matchsLoading ? "..." : totalMatchs}</div>
//             <div className="text-xs text-yellow-100/60 mt-1">Organisés</div>
//           </div>

//           <div className="bg-white/6 backdrop-blur-xl p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//             <div className="text-sm text-yellow-200/80">Revenus estimés</div>
//             <div className="text-3xl font-bold text-yellow-300 mt-2">{totalRevenus} DT</div>
//             <div className="text-xs text-yellow-100/60 mt-1">Somme (matchs filtrés)</div>
//           </div>
//         </div>

//         {/* Forms accordéons */}
//         <div className="space-y-4 mb-8">
//           {/* Création terrain */}
//           <div className="bg-white/6 p-3 rounded-2xl border border-yellow-300/20 shadow-lg">
//             <button
//               onClick={() => setOpenTerrainForm((s) => !s)}
//               className="w-full text-left text-yellow-300 font-semibold"
//               aria-expanded={openTerrainForm}
//             >
//               {openTerrainForm ? "▼" : "▶"} Ajouter un terrain
//             </button>

//             {openTerrainForm && (
//               <form onSubmit={handleCreateTerrain} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
//                 <input
//                   className="p-3 rounded bg-black/40 text-yellow-200 placeholder-yellow-100"
//                   placeholder="Nom du terrain"
//                   value={newTerrainNom}
//                   onChange={(e) => setNewTerrainNom(e.target.value)}
//                 />
//                 <input
//                   className="p-3 rounded bg-black/40 text-yellow-200 placeholder-yellow-100"
//                   placeholder="Ville"
//                   value={newTerrainVille}
//                   onChange={(e) => setNewTerrainVille(e.target.value)}
//                 />
//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     className="flex-1 p-3 rounded bg-black/40 text-yellow-200 placeholder-yellow-100"
//                     placeholder="Prix / heure (DT)"
//                     value={newTerrainPrix}
//                     onChange={(e) => setNewTerrainPrix(e.target.value)}
//                   />
//                   <button type="submit" className="px-4 py-2 rounded bg-green-500 text-black font-semibold">Créer</button>
//                 </div>
//               </form>
//             )}
//           </div>

//           {/* Création match */}
//           <div className="bg-white/6 p-3 rounded-2xl border border-yellow-300/20 shadow-lg">
//             <button
//               onClick={() => setOpenMatchForm((s) => !s)}
//               className="w-full text-left text-yellow-300 font-semibold"
//               aria-expanded={openMatchForm}
//             >
//               {openMatchForm ? "▼" : "▶"} Créer un match
//             </button>

//             {openMatchForm && (
//               <form onSubmit={handleCreateMatch} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
//                 <select
//                   className="p-3 rounded bg-black/40 text-yellow-200"
//                   value={newMatchTerrain}
//                   onChange={(e) => setNewMatchTerrain(e.target.value)}
//                 >
//                   <option value="">Sélectionner un terrain</option>
//                   {terrains.map((t) => (
//                     <option key={t._id} value={t._id}>{t.nom}</option>
//                   ))}
//                 </select>

//                 <input
//                   type="date"
//                   className="p-3 rounded bg-black/40 text-yellow-200"
//                   value={newMatchDate}
//                   onChange={(e) => setNewMatchDate(e.target.value)}
//                 />

//                 <input
//                   type="time"
//                   className="p-3 rounded bg-black/40 text-yellow-200"
//                   value={newMatchHeure}
//                   onChange={(e) => setNewMatchHeure(e.target.value)}
//                 />

//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     className="p-3 rounded bg-black/40 text-yellow-200"
//                     placeholder="Prix / joueur"
//                     value={newMatchPrix}
//                     onChange={(e) => setNewMatchPrix(e.target.value)}
//                   />
//                   <button type="submit" className="px-4 py-2 rounded bg-yellow-300 text-black font-semibold">Créer</button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* Filters + list toggle */}
//         <div className="flex flex-col md:flex-row gap-3 items-center mb-6">
//           <input
//             placeholder="Recherche (adversaire / terrain / ville...)"
//             className="flex-1 p-3 rounded bg-black/40 text-yellow-200"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <select
//             className="p-3 rounded bg-black/40 text-yellow-200"
//             value={filterTerrain}
//             onChange={(e) => setFilterTerrain(e.target.value)}
//           >
//             <option value="all">Tous les terrains</option>
//             {terrains.map((t) => (
//               <option key={t._id} value={t._id}>{t.nom}</option>
//             ))}
//           </select>
//           <input
//             type="date"
//             className="p-3 rounded bg-black/40 text-yellow-200"
//             value={filterDate}
//             onChange={(e) => setFilterDate(e.target.value)}
//           />
//           <button
//             onClick={() => setOpenMatchList((s) => !s)}
//             className="px-3 py-2 rounded bg-yellow-300 text-black font-semibold"
//           >
//             {openMatchList ? "Masquer la liste" : "Afficher la liste"}
//           </button>
//         </div>

//         {/* CHARTS + Lists */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                      {/* Match list collapsible */}
//             {openMatchList && (
//               <div className="bg-white/6 p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-yellow-300">Liste des matchs (filtrés)</h3>
//                   <div className="text-xs text-yellow-100/70">{filteredMatchs.length} résultats</div>
//                 </div>

//                 {filteredMatchs.length === 0 ? (
//                   <p className="text-yellow-100/70">Aucun match trouvé</p>
//                 ) : (
//                   <ul className="space-y-3">
//                     {filteredMatchs.map((m) => (
//                     <li key={m._id}>
//   <Link
//     href={`/matchs/${m._id}`}
//     className="block p-3 bg-black/30 hover:bg-black/40 rounded-xl 
//                text-yellow-300 font-bold shadow-lg backdrop-blur-md transition"
//   >
//     <div className="flex justify-between items-center">
//       <div>
//         <div className="text-lg">{m.adversaire || "Match"}</div>
//         <div className="text-xs text-yellow-200/70">
//           {m.date} — {m.heure} • {m.terrain?.nom}
//         </div>
//       </div>
//       <div className="text-yellow-400 font-semibold">
//         {Number(m.prixParJoueur ?? 0)} DT
//       </div>
//     </div>
//   </Link>
// </li>

//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}
//           {/* Left: charts + match list */}
//           <div className="space-y-6">
//             <div className="bg-white/6 p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//               <h3 className="text-yellow-300 mb-3">Revenus (par match)</h3>
//               <Line data={revenuChart} />
//             </div>

//             <div className="bg-white/6 p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//               <h3 className="text-yellow-300 mb-3">Occupation par terrain</h3>
//               <Bar data={occupationChart} />
//             </div>

 
//           </div>

//           {/* Right: terrains list */}
//           <div className="space-y-6">
//             <div className="bg-white/6 p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//               <h3 className="text-yellow-300 mb-3">Mes Terrains</h3>
//               {terrains.length === 0 ? (
//                 <p className="text-yellow-100/70">Aucun terrain</p>
//               ) : (
//                 <ul className="space-y-2">
//                   {terrains.map((t) => (
//                     <li key={t._id} className="p-3 bg-black/30 rounded flex justify-between items-center">
//                       <div>
//                         <div className="font-semibold text-yellow-200">{t.nom}</div>
//                         <div className="text-xs text-yellow-100/60">{t.ville}</div>
//                       </div>
//                       <div className="text-yellow-200 font-medium">{t.prixHeure ?? 0} DT</div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* errors */}
//         {(terrainsError || matchsError) && (
//           <div className="mt-6 p-4 rounded bg-red-700/40 text-white">
//             Erreur : {terrainsError || matchsError}
//           </div>
//         )}
//       </div>
//     </StadiumBackground>
//   );
// }



// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { listMyTerrains, createTerrain } from "@/redux/actions/terrainActions";
// import { listMyMatchs, createMatch } from "@/redux/actions/matchActions";
// import StadiumBackground from "@/components/StadiumBackground";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend
// );

// export default function ProprietairePage({ params }) {
//   const { id } = React.use(params);
//   const dispatch = useDispatch();

//   // Redux
//   const terrainMine = useSelector((state) => state.terrainMine || {});
//   const { terrains = [], loading: terrainsLoading, error: terrainsError } = terrainMine;

//   const matchListMy = useSelector((state) => state.matchListMy || {});
//   const { matchs = [], loading: matchsLoading, error: matchsError } = matchListMy;

//   const proprietaireSignin = useSelector((state) => state.proprietaireSignin || {});
//   const { proprietaireInfo } = proprietaireSignin;

//   // UI states
//   const [search, setSearch] = useState("");
//   const [filterTerrain, setFilterTerrain] = useState("all");
//   const [filterDate, setFilterDate] = useState("");

//   // accordéons
//   const [openTerrainForm, setOpenTerrainForm] = useState(false);
//   const [openMatchForm, setOpenMatchForm] = useState(false);

//   // forms
//   const [newTerrainNom, setNewTerrainNom] = useState("");
//   const [newTerrainVille, setNewTerrainVille] = useState("");
//   const [newTerrainPrix, setNewTerrainPrix] = useState("");

//   const [newMatchTerrain, setNewMatchTerrain] = useState("");
//   const [newMatchDate, setNewMatchDate] = useState("");
//   const [newMatchHeure, setNewMatchHeure] = useState("");
//   const [newMatchPrix, setNewMatchPrix] = useState("");

//   /** Load data */
//   useEffect(() => {
//     dispatch(listMyTerrains());
//     dispatch(listMyMatchs());
//   }, [dispatch, id]);

//   /** Filtered matches */
//   const filteredMatchs = useMemo(() => {
//     return matchs.filter((m) => {
//       const terrainName = m.terrain?.nom || "";
//       if (filterTerrain !== "all" && (m.terrain?._id || m.terrain) !== filterTerrain) return false;
//       if (filterDate && !m.date?.startsWith(filterDate)) return false;

//       if (!search) return true;
//       const s = search.toLowerCase();
//       return (
//         (m.adversaire || "").toLowerCase().includes(s) ||
//         terrainName.toLowerCase().includes(s) ||
//         (m.terrain?.ville || "").toLowerCase().includes(s)
//       );
//     });
//   }, [matchs, search, filterTerrain, filterDate]);

//   /** Stats */
//   const totalTerrains = terrains.length;
//   const totalMatchs = filteredMatchs.length;
//   const totalRevenus = filteredMatchs.reduce((acc, m) => acc + (Number(m.prixParJoueur ?? m.prix ?? 0)), 0);

//   /** Charts */
//   const revenuChart = useMemo(() => ({
//     labels: filteredMatchs.map((m) => m.date),
//     datasets: [
//       {
//         label: "Revenus (par match)",
//         data: filteredMatchs.map((m) => Number(m.prixParJoueur ?? m.prix ?? 0)),
//         borderColor: "yellow",
//         backgroundColor: "rgba(255,255,0,0.3)",
//         tension: 0.25,
//       },
//     ],
//   }), [filteredMatchs]);

//   const occupationChart = useMemo(() => ({
//     labels: terrains.map((t) => t.nom),
//     datasets: [
//       {
//         label: "Nombre de matchs",
//         data: terrains.map(
//           (t) =>
//             matchs.filter((m) => {
//               const tid = m.terrain?._id || m.terrain;
//               return tid && tid.toString() === t._id.toString();
//             }).length
//         ),
//         backgroundColor: "rgba(255,255,0,0.4)",
//         borderColor: "yellow",
//       },
//     ],
//   }), [terrains, matchs]);

//   /** Create handlers */
//   const handleCreateTerrain = async (e) => {
//     e.preventDefault();
//     await dispatch(createTerrain({
//       nom: newTerrainNom,
//       ville: newTerrainVille,
//       prixHeure: Number(newTerrainPrix),
//     }));
//     dispatch(listMyTerrains());
//     setNewTerrainNom("");
//     setNewTerrainVille("");
//     setNewTerrainPrix("");
//   };

//   const handleCreateMatch = async (e) => {
//     e.preventDefault();
//     await dispatch(createMatch({
//       terrainId: newMatchTerrain,
//       date: newMatchDate,
//       heure: newMatchHeure,
//       prixParJoueur: Number(newMatchPrix),
//     }));
//     dispatch(listMyMatchs());
//     setNewMatchTerrain("");
//     setNewMatchDate("");
//     setNewMatchHeure("");
//     setNewMatchPrix("");
//   };

//   return (
//     <StadiumBackground rotateOnMobile={true}>
//       {/* OVERLAY */}
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

//       <div className="relative w-full max-w-6xl mx-auto py-10 px-4">
//         <header className="mb-8">
//           <h1 className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg">
//             Espace Propriétaire
//           </h1>
//           <p className="text-yellow-100/80 mt-1">
//             Bonjour <span className="font-semibold text-white">{proprietaireInfo?.nom}</span> — ID :
//             <span className="font-mono text-green-300"> {id}</span>
//           </p>
//         </header>

//         {/* STAT CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
//           {[
//             { label: "Terrains", value: totalTerrains },
//             { label: "Matchs", value: totalMatchs },
//             { label: "Revenus (DT)", value: totalRevenus },
//           ].map((c, i) => (
//             <div key={i}
//               className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-yellow-300/20"
//             >
//               <div className="text-yellow-200/70">{c.label}</div>
//               <div className="text-4xl font-bold text-yellow-300 mt-1">{c.value}</div>
//             </div>
//           ))}
//         </div>

//         {/* ACCORDEONS — FORMULAIRES */}
//         <div className="space-y-4 mb-10">

//           {/* Terrain form */}
//           <div className="bg-white/10 p-4 rounded-2xl border border-yellow-300/30 shadow-lg">
//             <button
//               onClick={() => setOpenTerrainForm(!openTerrainForm)}
//               className="w-full text-left text-yellow-300 font-semibold text-lg"
//             >
//               ➕ Ajouter un terrain
//             </button>

//             {openTerrainForm && (
//               <form onSubmit={handleCreateTerrain} className="mt-4 space-y-3 animate-fade">
//                 <input className="w-full p-3 rounded bg-black/40 text-yellow-200 outline-none"
//                   placeholder="Nom" value={newTerrainNom}
//                   onChange={(e) => setNewTerrainNom(e.target.value)} />

//                 <input className="w-full p-3 rounded bg-black/40 text-yellow-200 outline-none"
//                   placeholder="Ville" value={newTerrainVille}
//                   onChange={(e) => setNewTerrainVille(e.target.value)} />

//                 <input type="number" className="w-full p-3 rounded bg-black/40 text-yellow-200 outline-none"
//                   placeholder="Prix / heure" value={newTerrainPrix}
//                   onChange={(e) => setNewTerrainPrix(e.target.value)} />

//                 <button className="px-4 py-2 bg-green-500 rounded-lg text-black font-semibold">
//                   Créer
//                 </button>
//               </form>
//             )}
//           </div>

//           {/* Match form */}
//           <div className="bg-white/10 p-4 rounded-2xl border border-yellow-300/30 shadow-lg">
//             <button
//               onClick={() => setOpenMatchForm(!openMatchForm)}
//               className="w-full text-left text-yellow-300 font-semibold text-lg"
//             >
//               ⚽ Créer un match
//             </button>

//             {openMatchForm && (
//               <form onSubmit={handleCreateMatch} className="mt-4 space-y-3 animate-fade">
//                 <select className="w-full p-3 rounded bg-black/40 text-yellow-200"
//                   value={newMatchTerrain}
//                   onChange={(e) => setNewMatchTerrain(e.target.value)}
//                 >
//                   <option value="">Sélectionner un terrain</option>
//                   {terrains.map((t) => (
//                     <option key={t._id} value={t._id}>{t.nom}</option>
//                   ))}
//                 </select>

//                 <input type="date"
//                   className="w-full p-3 rounded bg-black/40 text-yellow-200"
//                   value={newMatchDate}
//                   onChange={(e) => setNewMatchDate(e.target.value)}
//                 />

//                 <input type="time"
//                   className="w-full p-3 rounded bg-black/40 text-yellow-200"
//                   value={newMatchHeure}
//                   onChange={(e) => setNewMatchHeure(e.target.value)}
//                 />

//                 <input type="number"
//                   className="w-full p-3 rounded bg-black/40 text-yellow-200"
//                   placeholder="Prix / joueur"
//                   value={newMatchPrix}
//                   onChange={(e) => setNewMatchPrix(e.target.value)}
//                 />

//                 <button className="px-4 py-2 bg-yellow-300 rounded-lg text-black font-semibold">
//                   Créer
//                 </button>
//               </form>
//             )}
//           </div>

//         </div>

//         {/* CHARTS + TERRAIN LIST */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//           {/* Charts */}
//           <div className="space-y-6">
//             <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//               <h3 className="text-yellow-300 mb-3">Revenus (par match)</h3>
//               <Line data={revenuChart} />
//             </div>

//             <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//               <h3 className="text-yellow-300 mb-3">Occupation par terrain</h3>
//               <Bar data={occupationChart} />
//             </div>
//           </div>

//           {/* Terrains list */}
//           <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-yellow-300/20 shadow-lg">
//             <h3 className="text-yellow-300 mb-3">Mes Terrains</h3>
//             {terrains.length === 0 ? (
//               <p className="text-yellow-200/70">Aucun terrain</p>
//             ) : (
//               <ul className="space-y-2">
//                 {terrains.map((t) => (
//                   <li key={t._id}
//                     className="p-3 bg-black/30 rounded flex justify-between items-center"
//                   >
//                     <div>
//                       <div className="font-semibold text-yellow-300">{t.nom}</div>
//                       <div className="text-xs text-yellow-200/70">{t.ville}</div>
//                     </div>
//                     <div className="text-yellow-200 font-medium">{t.prixHeure} DT</div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>

//         {(terrainsError || matchsError) && (
//           <div className="mt-6 p-4 rounded bg-red-700/40 text-white">
//             Erreur : {terrainsError || matchsError}
//           </div>
//         )}
//       </div>
//     </StadiumBackground>
//   );
// }



// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { listMyTerrains, createTerrain } from "@/redux/actions/terrainActions";
// import { listMyMatchs, createMatch } from "@/redux/actions/matchActions";
// import StadiumBackground from "@/components/StadiumBackground";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend
// );

// export default function ProprietairePage({ params }) {
//   // Next.js app-router: unwrap params (pattern utilisé dans ton projet)
//   const { id } = React.use(params);

//   const dispatch = useDispatch();

//   // Redux slices you already have
//   const terrainMine = useSelector((state) => state.terrainMine || {});
//   const { terrains = [], loading: terrainsLoading, error: terrainsError } = terrainMine;

//   const matchListMy = useSelector((state) => state.matchListMy || {});
//   const { matchs = [], loading: matchsLoading, error: matchsError } = matchListMy;

//   const proprietaireSignin = useSelector((state) => state.proprietaireSignin || {});
//   const { proprietaireInfo } = proprietaireSignin || {};

//   // local UI states
//   const [search, setSearch] = useState("");
//   const [filterTerrain, setFilterTerrain] = useState("all");
//   const [filterDate, setFilterDate] = useState("");

//   // form : terrain
//   const [newTerrainNom, setNewTerrainNom] = useState("");
//   const [newTerrainVille, setNewTerrainVille] = useState("");
//   const [newTerrainPrix, setNewTerrainPrix] = useState("");

//   // form : match
//   const [newMatchTerrain, setNewMatchTerrain] = useState("");
//   const [newMatchDate, setNewMatchDate] = useState("");
//   const [newMatchHeure, setNewMatchHeure] = useState("");
//   const [newMatchPrix, setNewMatchPrix] = useState("");

//   // load data
//   useEffect(() => {
//     // load owner's terrains + matchs (server endpoints use token from proprietaireSignin)
//     dispatch(listMyTerrains());
//     dispatch(listMyMatchs());
//   }, [dispatch, id]);

//   // Refresh after create success: we don't have access to those specific success flags here (depends on your reducers).
//   // So after create operations below we re-dispatch list actions.

//   // Filter + search computed
//   const filteredMatchs = useMemo(() => {
//     return matchs.filter((m) => {
//       // m.terrain may be populated object (terrain) or id depending on your backend -> handle both
//       const terrainName = m.terrain?.nom || m.terrain?.toString?.() || "";
//       if (filterTerrain !== "all" && (m.terrain?._id || m.terrain) !== filterTerrain) return false;
//       if (filterDate && !m.date?.startsWith(filterDate)) return false;

//       if (!search) return true;
//       const s = search.toLowerCase();
//       return (
//         (m.adversaire || "").toLowerCase().includes(s) ||
//         terrainName.toLowerCase().includes(s) ||
//         (m.terrain?.ville || "").toLowerCase().includes(s)
//       );
//     });
//   }, [matchs, search, filterTerrain, filterDate]);

//   // Stats
//   const totalTerrains = terrains.length;
//   const totalMatchs = filteredMatchs.length;
//   const totalRevenus = filteredMatchs.reduce((acc, m) => acc + (Number(m.prixParJoueur ?? m.prix ?? 0)), 0);

//   // Graph data: revenues over time (line) + occupation per terrain (bar)
//   const revenuChart = useMemo(() => {
//     const labels = filteredMatchs.map((m) => m.date || m._id);
//     const data = filteredMatchs.map((m) => Number(m.prixParJoueur ?? m.prix ?? 0));
//     return {
//       labels,
//       datasets: [
//         {
//           label: "Revenus (par match)",
//           data,
//           fill: false,
//           tension: 0.2,
//         },
//       ],
//     };
//   }, [filteredMatchs]);

//   const occupationChart = useMemo(() => {
//     const labels = terrains.map((t) => t.nom || t._id);
//     const data = terrains.map(
//       (t) =>
//         matchs.filter((m) => {
//           const tid = m.terrain?._id || m.terrain;
//           return tid && tid.toString() === (t._id ? t._id.toString() : t.toString());
//         }).length
//     );
//     return {
//       labels,
//       datasets: [
//         {
//           label: "Nombre de matchs",
//           data,
//         },
//       ],
//     };
//   }, [terrains, matchs]);

//   // Create handlers
//   const handleCreateTerrain = async (e) => {
//     e.preventDefault();
//     if (!newTerrainNom) return alert("Nom du terrain requis");
//     const payload = {
//       nom: newTerrainNom,
//       ville: newTerrainVille,
//       prixHeure: newTerrainPrix ? Number(newTerrainPrix) : 0,
//     };
//     await dispatch(createTerrain(payload));
//     // refresh
//     setNewTerrainNom("");
//     setNewTerrainVille("");
//     setNewTerrainPrix("");
//     dispatch(listMyTerrains());
//   };

//   const handleCreateMatch = async (e) => {
//     e.preventDefault();
//     if (!newMatchTerrain || !newMatchDate || !newMatchHeure) return alert("Compléter tous les champs du match");
//     const payload = {
//       terrainId: newMatchTerrain,
//       date: newMatchDate,
//       heure: newMatchHeure,
//       prixParJoueur: newMatchPrix ? Number(newMatchPrix) : 0,
//     };
//     await dispatch(createMatch(payload));
//     // refresh
//     setNewMatchTerrain("");
//     setNewMatchDate("");
//     setNewMatchHeure("");
//     setNewMatchPrix("");
//     dispatch(listMyMatchs());
//   };

//   return (
//     <StadiumBackground rotateOnMobile={true}>
//       <div className="w-full max-w-6xl mx-auto py-8 px-4">
//         <header className="mb-8">
//           <h1 className="text-4xl font-extrabold text-white">Espace Propriétaire</h1>
//           <p className="text-white/70 mt-1">
//             Bonjour <span className="font-semibold">{proprietaireInfo?.nom || "Propriétaire"}</span> — page liée à l'id <span className="font-mono">{id}</span>
//           </p>
//         </header>

//         {/* STAT CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white/5 p-5 rounded-2xl shadow">
//             <div className="text-sm text-white/60">Terrains</div>
//             <div className="text-3xl font-bold text-white mt-2">{terrainsLoading ? "..." : totalTerrains}</div>
//             <div className="text-xs text-white/50 mt-1">Terrains liés à votre compte</div>
//           </div>

//           <div className="bg-white/5 p-5 rounded-2xl shadow">
//             <div className="text-sm text-white/60">Matchs (filtrés)</div>
//             <div className="text-3xl font-bold text-white mt-2">{matchsLoading ? "..." : totalMatchs}</div>
//             <div className="text-xs text-white/50 mt-1">Matchs organisés</div>
//           </div>

//           <div className="bg-white/5 p-5 rounded-2xl shadow">
//             <div className="text-sm text-white/60">Revenus estimés</div>
//             <div className="text-3xl font-bold text-white mt-2">{totalRevenus} DT</div>
//             <div className="text-xs text-white/50 mt-1">Somme des montants (matchs filtrés)</div>
//           </div>
//         </div>

//         {/* FILTERS */}
//         <div className="flex flex-col md:flex-row gap-3 items-center mb-6">
//           <input
//             placeholder="Recherche (adversaire / terrain / ville...)"
//             className="flex-1 p-3 rounded-lg bg-white/10 text-white outline-none"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <select
//             className="p-3 rounded-lg bg-white/10 text-white"
//             value={filterTerrain}
//             onChange={(e) => setFilterTerrain(e.target.value)}
//           >
//             <option value="all">Tous les terrains</option>
//             {terrains.map((t) => (
//               <option key={t._id} value={t._id}>
//                 {t.nom}
//               </option>
//             ))}
//           </select>
//           <input
//             type="date"
//             className="p-3 rounded-lg bg-white/10 text-white"
//             value={filterDate}
//             onChange={(e) => setFilterDate(e.target.value)}
//           />
//         </div>

//         {/* CHARTS + lists / forms */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left: Charts + match list */}
//           <div className="space-y-6">
//             <div className="bg-white/5 p-4 rounded-2xl shadow">
//               <h3 className="text-lg font-semibold text-white mb-3">Revenus (par match)</h3>
//               <div>
//                 <Line data={revenuChart} />
//               </div>
//             </div>

//             <div className="bg-white/5 p-4 rounded-2xl shadow">
//               <h3 className="text-lg font-semibold text-white mb-3">Occupation par terrain</h3>
//               <div>
//                 <Bar data={occupationChart} />
//               </div>
//             </div>

//             <div className="bg-white/5 p-4 rounded-2xl shadow">
//               <h3 className="text-lg font-semibold text-white mb-3">Liste des matchs (filtrés)</h3>
//               {filteredMatchs.length === 0 ? (
//                 <p className="text-white/60">Aucun match trouvé</p>
//               ) : (
//                 <ul className="space-y-2">
//                   {filteredMatchs.map((m) => (
//                     <li key={m._id} className="p-3 bg-white/6 rounded flex justify-between items-center">
//                       <div>
//                         <div className="font-semibold text-white">{m.adversaire || "Match"}</div>
//                         <div className="text-xs text-white/60">{m.date} {m.heure ? `• ${m.heure}` : ""} — {m.terrain?.nom || m.terrain}</div>
//                       </div>
//                       <div className="text-white font-medium">{Number(m.prixParJoueur ?? m.prix ?? 0)} DT</div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>

//           {/* Right: Terrains list + forms create */}
//           <div className="space-y-6">
//             {/* Terrains list */}
//             <div className="bg-white/5 p-4 rounded-2xl shadow">
//               <h3 className="text-lg font-semibold text-white mb-3">Mes Terrains</h3>
//               {terrains.length === 0 ? (
//                 <p className="text-white/60">Aucun terrain</p>
//               ) : (
//                 <ul className="space-y-2">
//                   {terrains.map((t) => (
//                     <li key={t._id} className="p-3 bg-white/6 rounded flex justify-between items-center">
//                       <div>
//                         <div className="font-semibold text-white">{t.nom}</div>
//                         <div className="text-xs text-white/60">{t.ville || "Ville non spécifiée"}</div>
//                       </div>
//                       <div className="text-white font-medium">{t.prixHeure ?? "0"} DT</div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* Create Terrain */}
//             <div className="bg-white/5 p-4 rounded-2xl shadow">
//               <h3 className="text-lg font-semibold text-white mb-3">Ajouter un terrain</h3>
//               <form onSubmit={handleCreateTerrain} className="space-y-3">
//                 <input
//                   className="w-full p-3 rounded bg-white/10 text-white"
//                   placeholder="Nom du terrain"
//                   value={newTerrainNom}
//                   onChange={(e) => setNewTerrainNom(e.target.value)}
//                 />
//                 <input
//                   className="w-full p-3 rounded bg-white/10 text-white"
//                   placeholder="Ville"
//                   value={newTerrainVille}
//                   onChange={(e) => setNewTerrainVille(e.target.value)}
//                 />
//                 <input
//                   type="number"
//                   className="w-full p-3 rounded bg-white/10 text-white"
//                   placeholder="Prix / heure (DT)"
//                   value={newTerrainPrix}
//                   onChange={(e) => setNewTerrainPrix(e.target.value)}
//                 />
//                 <div className="flex gap-2">
//                   <button type="submit" className="px-4 py-2 rounded bg-green-600">Créer terrain</button>
//                   <button type="button" onClick={() => { setNewTerrainNom(""); setNewTerrainVille(""); setNewTerrainPrix(""); }} className="px-4 py-2 rounded bg-gray-600">Annuler</button>
//                 </div>
//               </form>
//             </div>

//             {/* Create Match */}
//             <div className="bg-white/5 p-4 rounded-2xl shadow">
//               <h3 className="text-lg font-semibold text-white mb-3">Créer un match</h3>
//               <form onSubmit={handleCreateMatch} className="space-y-3">
//                 <select
//                   className="w-full p-3 rounded bg-white/10 text-white"
//                   value={newMatchTerrain}
//                   onChange={(e) => setNewMatchTerrain(e.target.value)}
//                 >
//                   <option value="">Sélectionner un terrain</option>
//                   {terrains.map((t) => (
//                     <option key={t._id} value={t._id}>{t.nom}</option>
//                   ))}
//                 </select>

//                 <input
//                   type="date"
//                   className="w-full p-3 rounded bg-white/10 text-white"
//                   value={newMatchDate}
//                   onChange={(e) => setNewMatchDate(e.target.value)}
//                 />
//                 <input
//                   type="time"
//                   className="w-full p-3 rounded bg-white/10 text-white"
//                   value={newMatchHeure}
//                   onChange={(e) => setNewMatchHeure(e.target.value)}
//                 />
//                 <input
//                   type="number"
//                   className="w-full p-3 rounded bg-white/10 text-white"
//                   placeholder="Prix par joueur (DT)"
//                   value={newMatchPrix}
//                   onChange={(e) => setNewMatchPrix(e.target.value)}
//                 />

//                 <div className="flex gap-2">
//                   <button type="submit" className="px-4 py-2 rounded bg-blue-600">Créer match</button>
//                   <button type="button" onClick={() => { setNewMatchTerrain(""); setNewMatchDate(""); setNewMatchHeure(""); setNewMatchPrix(""); }} className="px-4 py-2 rounded bg-gray-600">Annuler</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* errors */}
//         {(terrainsError || matchsError) && (
//           <div className="mt-6 p-4 rounded bg-red-700/40 text-white">
//             Erreur : {terrainsError || matchsError}
//           </div>
//         )}
//       </div>
//     </StadiumBackground>
//   );
// }
