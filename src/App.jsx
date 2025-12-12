import { useState, useEffect } from "react";

// --- CONFIGURATION ---
const API_BASE_URL = "http://127.0.0.1:8000";

// --- FONCTIONS API ---

async function poserQuestion(question) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/workflow/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question,
        max_par_site: 15,
        sources: ["wikipedia", "github", "youtube"],
        langues: ["fr", "en"],
        top_k_faiss: 50,
        top_k_final: 10
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur API (${res.status}): ${errorText}`);
    }
    const data = await res.json();
    return data.resultats || [];
  } catch (error) {
    console.error("Erreur Workflow:", error);
    throw error;
  }
}

async function envoyerFeedback(item, type) {
  const payload = {
    inference_id: item.id_inference,  
    feedback_type: type               
  };
  
  console.log(`📤 Vote envoyé (${type})`, payload);

  try {
    await fetch(`${API_BASE_URL}/api/reranking/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Erreur réseau:", err);
  }
}

// --- COMPOSANTS UI ---

// Badge pour la source (Wikipedia, Github, etc.)
const SourceBadge = ({ source }) => {
  const s = source ? source.toLowerCase() : "web";
  let colors = "bg-gray-700 text-gray-300 border-gray-600";
  let icon = "🌐";

  if (s.includes("github")) {
    colors = "bg-slate-800 text-white border-slate-600";
    icon = "💻";
  } else if (s.includes("wikipedia")) {
    colors = "bg-gray-100 text-gray-800 border-gray-300";
    icon = "📚";
  } else if (s.includes("youtube")) {
    colors = "bg-yellow-900/40 text-yellow-200 border-yellow-700/50";
    icon = "✍️";
  }

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors} flex items-center gap-1.5`}>
      <span>{icon}</span>
      {source}
    </span>
  );
};

export default function App() {
  const [question, setQuestion] = useState("");
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [votes, setVotes] = useState({}); 

  const handleSubmit = async () => {
    if (!question) return;
    setVotes({}); // Reset votes
    setLoading(true);
    setResultats([]); 
    setHasSearched(true);
    
    try {
      const data = await poserQuestion(question);
      setResultats(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (index, item, type) => {
    const voteActuel = votes[index];
    if (voteActuel === type) {
      const nouveauxVotes = { ...votes };
      delete nouveauxVotes[index];
      setVotes(nouveauxVotes);
      return;
    }
    envoyerFeedback(item, type);
    setVotes((prev) => ({ ...prev, [index]: type }));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 font-sans selection:bg-blue-500/30">
      
      {/* Arrière-plan décoratif */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
        
        {/* EN-TÊTE / SEARCH HERO */}
        <div className={`w-full max-w-3xl transition-all duration-700 ease-out flex flex-col items-center ${hasSearched ? 'mt-4 scale-95' : 'mt-[20vh] scale-100'}`}>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 mb-8 text-center leading-tight">
            EduRanker AI
          </h1>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="w-full relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2 shadow-2xl">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Quelle compétence voulez-vous maîtriser aujourd'hui ?"
                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-gray-500 px-4 py-3"
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2
                  ${loading 
                    ? "bg-gray-800 text-gray-500 cursor-wait" 
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/30 active:scale-95"
                  }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Explorer</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* LISTE DES RÉSULTATS */}
        <div className={`w-full max-w-4xl mt-12 pb-20 transition-all duration-700 ${resultats.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-6">
            {resultats.map((r, i) => (
              <div 
                key={i} 
                className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-800 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-gray-800/80"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  
                  {/* Contenu Principal */}
                  <div className="flex-1 min-w-0">
                    
                    {/* Header Carte */}
                    <div className="flex items-center gap-3 mb-3">
                      <SourceBadge source={r.source} />
                      <span className="text-gray-500 text-xs">•</span>
                      <span className="text-xs text-gray-400 font-medium truncate">
                        {r.auteur || "Auteur inconnu"}
                      </span>
                      {r.date && (
                        <>
                          <span className="text-gray-500 text-xs">•</span>
                          <span className="text-xs text-gray-500">{r.date}</span>
                        </>
                      )}
                    </div>

                    {/* Titre */}
                    <h2 className="text-xl font-bold text-gray-100 mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-2 underline-offset-4 decoration-blue-500/50">
                        {r.titre || "Document sans titre"}
                      </a>
                    </h2>

                    {/* RÉSUMÉ (Nouveauté) */}
                    <div className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-3">
                      {/* On essaie plusieurs champs potentiels pour le résumé */}
                      {r.resume || r.description || r.snippet || r.text || (
                        <span className="italic text-gray-600">Aucun résumé disponible.</span>
                      )}
                    </div>

                    {/* Mots-clés */}
                    {r.mots_cles && r.mots_cles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {r.mots_cles.slice(0, 4).map((mc, idx) => (
                          <span key={idx} className="text-[10px] uppercase font-bold text-blue-300 bg-blue-900/20 px-2 py-1 rounded border border-blue-800/30">
                            #{mc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Colonne de droite : Score & Actions */}
                  <div className="flex md:flex-col justify-between items-center md:items-end gap-4 pl-0 md:pl-6 md:border-l border-gray-700/50 min-w-[100px]">
                    
                    {/* Score Circulaire */}
                    <div className="text-center group-hover:scale-105 transition-transform duration-300">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 28} 
                            strokeDashoffset={2 * Math.PI * 28 * (1 - (r.score_final || 0))} 
                            className="text-emerald-500" 
                          />
                        </svg>
                        <span className="absolute text-sm font-bold text-white">
                          {((r.score_final || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1 font-medium uppercase tracking-wider">Pertinence</div>
                    </div>

                    {/* Boutons Actions */}
                    <div className="flex gap-2 bg-gray-950/50 p-1.5 rounded-full border border-gray-800">
                      <button 
                        onClick={() => handleVote(i, r, "like")} 
                        className={`p-2 rounded-full transition-all duration-300 ${
                          votes[i] === "like" 
                          ? "bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-110" 
                          : "text-gray-400 hover:text-green-400 hover:bg-gray-800"
                        }`}
                        title="Pertinent"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                      </button>

                      <button 
                        onClick={() => handleVote(i, r, "dislike")} 
                        className={`p-2 rounded-full transition-all duration-300 ${
                          votes[i] === "dislike" 
                          ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-110" 
                          : "text-gray-400 hover:text-red-400 hover:bg-gray-800"
                        }`}
                        title="Non pertinent"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}