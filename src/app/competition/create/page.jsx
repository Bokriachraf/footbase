"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CompetitionPage() {
  const [nom, setNom] = useState("");
  const [type, setType] = useState("CHAMPIONNAT");
  const [categorie, setCategorie] = useState("REGIONAL");
  const [phaseType, setPhaseType] = useState("SANS_GROUPES");
  const [gouvernorat, setGouvernorat] = useState("");
  const [saison, setSaison] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [nbEquipes, setNbEquipes] = useState("");
  const [terrains, setTerrains] = useState([]);
  const [selectedTerrains, setSelectedTerrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { proprietaireInfo } = useSelector(
    (state) => state.proprietaireSignin
  );

  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        const { data } = await axios.get(`${API}/api/terrains`, {
          headers: {
            Authorization: `Bearer ${proprietaireInfo?.token}`,
          },
        });
        setTerrains(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (proprietaireInfo?.token) {
      fetchTerrains();
    }
  }, [proprietaireInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        `${API}/api/competitions`,
        {
          nom,
          type,
          categorie,
          gouvernorat: categorie === "REGIONAL" ? gouvernorat : undefined,
          saison,
          dateDebut,
          dateFin,
          nbEquipes: Number(nbEquipes),
          terrains: selectedTerrains,
        },
        {
          headers: {
            Authorization: `Bearer ${proprietaireInfo?.token}`,
          },
        }
      );

      setMessage("✅ Compétition créée avec succès");

      // reset form
      setNom("");
      setType("CHAMPIONNAT");
      setCategorie("REGIONAL");
      setGouvernorat("");
      setSaison("");
      setDateDebut("");
      setDateFin("");
      setNbEquipes("");
      setSelectedTerrains([]);
    } catch (error) {
      console.error(error);
      setMessage("❌ Erreur lors de la création de la compétition");
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid =
    !nom || !dateDebut || !dateFin || !nbEquipes || selectedTerrains.length === 0;

  return (
    <div className="max-w-md mx-auto p-4 py-8">
      <h1 className="text-xl font-bold mb-4 text-center">
        Créer une compétition
      </h1>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="text"
          placeholder="Nom de la compétition"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="CHAMPIONNAT">Championnat</option>
          <option value="TOURNOI">Tournoi</option>
        </select>

        {type === "TOURNOI" && (
  <select
    value={phaseType}
    onChange={(e) => setPhaseType(e.target.value)}
    className="w-full p-2 border rounded"
    required
  >
    <option value="SANS_GROUPES">
      🔴 Élimination directe (sans groupes)
    </option>
    <option value="AVEC_GROUPES">
      🟢 Phase de groupes puis élimination
    </option>
  </select>
)}

        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="REGIONAL">Régional</option>
          <option value="SCOLAIRE">Scolaire</option>
          <option value="ENTREPRISE">Entreprise</option>
          <option value="LIBRE">Libre</option>
        </select>

        {categorie === "REGIONAL" && (
          <input
            type="text"
            placeholder="Gouvernorat"
            value={gouvernorat}
            onChange={(e) => setGouvernorat(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}

        <input
          type="text"
          placeholder="Saison (ex: 2027/2028)"
          value={saison}
          onChange={(e) => setSaison(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="date"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          min="2"
          placeholder="Nombre d'équipes"
          value={nbEquipes}
          onChange={(e) => setNbEquipes(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <div>
          <p className="font-semibold mb-1">Terrains</p>
          <div className="space-y-1">
            {terrains.map((terrain) => (
              <label
                key={terrain._id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedTerrains.includes(terrain._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTerrains([...selectedTerrains, terrain._id]);
                    } else {
                      setSelectedTerrains(
                        selectedTerrains.filter((id) => id !== terrain._id)
                      );
                    }
                  }}
                />
                {terrain.nom} – {terrain.ville}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || isFormInvalid}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer la compétition"}
        </button>

        {message && (
          <p className="text-center text-sm mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}




// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const API = process.env.NEXT_PUBLIC_API_URL;

// export default function CompetitionPage() {
//   const [nom, setNom] = useState("");
//   const [type, setType] = useState("CHAMPIONNAT");
//   const [categorie, setCategorie] = useState("REGIONAL");
//   const [gouvernorat, setGouvernorat] = useState("");
//   const [saison, setSaison] = useState("");
//   const [terrains, setTerrains] = useState([]);
//   const [selectedTerrains, setSelectedTerrains] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

// const { proprietaireInfo } = useSelector(
//   (state) => state.proprietaireSignin);
// //   const proprietaireInfo =
// //     typeof window !== "undefined"
// //       ? JSON.parse(localStorage.getItem("proprietaireInfo"))
// //       : null;
// console.log("API =", API);
//   useEffect(() => {
//     const fetchTerrains = async () => {
//       try {
//         const { data } = await axios.get(`${API}/api/terrains`, {
//           headers: {
//             Authorization: `Bearer ${proprietaireInfo?.token}`,
//           },
//         });
//         setTerrains(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchTerrains();
//   }, []);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       await axios.post(
//         `${API}/api/competitions`,
//         {
//           nom,
//           type,
//           categorie,
//           gouvernorat: categorie === "REGIONAL" ? gouvernorat : undefined,
//           saison,
//           terrains: selectedTerrains,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${proprietaireInfo?.token}`,
//           },
//         }
//       );

//       setMessage("✅ Compétition créée avec succès");
//       setNom("");
//       setGouvernorat("");
//       setSaison("");
//       setSelectedTerrains([]);
//     } catch (error) {
//       setMessage("❌ Erreur lors de la création");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h1 className="text-xl font-bold mb-4 text-center">
//         Créer une compétition
//       </h1>

//       <form onSubmit={submitHandler} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Nom de la compétition"
//           value={nom}
//           onChange={(e) => setNom(e.target.value)}
//           required
//           className="w-full p-2 border rounded"
//         />

//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="CHAMPIONNAT">Championnat</option>
//           <option value="TOURNOI">Tournoi</option>
//         </select>

//         <select
//           value={categorie}
//           onChange={(e) => setCategorie(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="REGIONAL">Régional</option>
//           <option value="SCOLAIRE">Scolaire</option>
//           <option value="ENTREPRISE">Entreprise</option>
//           <option value="LIBRE">Libre</option>
//         </select>

//         {categorie === "REGIONAL" && (
//           <input
//             type="text"
//             placeholder="Gouvernorat"
//             value={gouvernorat}
//             onChange={(e) => setGouvernorat(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         )}

//         <input
//           type="text"
//           placeholder="Saison (ex: 2025/2026)"
//           value={saison}
//           onChange={(e) => setSaison(e.target.value)}
//           className="w-full p-2 border rounded"
//         />

//         <div>
//           <p className="font-semibold mb-1">Terrains</p>
//           <div className="space-y-1">
//             {terrains.map((terrain) => (
//               <label
//                 key={terrain._id}
//                 className="flex items-center gap-2 text-sm"
//               >
//                 <input
//                   type="checkbox"
//                   value={terrain._id}
//                   checked={selectedTerrains.includes(terrain._id)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedTerrains([
//                         ...selectedTerrains,
//                         terrain._id,
//                       ]);
//                     } else {
//                       setSelectedTerrains(
//                         selectedTerrains.filter((id) => id !== terrain._id)
//                       );
//                     }
//                   }}
//                 />
//                 {terrain.nom} – {terrain.ville}
//               </label>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white p-2 rounded"
//         >
//           {loading ? "Création..." : "Créer la compétition"}
//         </button>

//         {message && (
//           <p className="text-center text-sm mt-2">{message}</p>
//         )}
//       </form>
//     </div>
//   );
// }
