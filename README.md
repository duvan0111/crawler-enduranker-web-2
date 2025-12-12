# 🎓 EduRanker AI - Frontend

Une interface web moderne et élégante pour explorer et classer des ressources éducatives provenant de multiples sources (Wikipedia, GitHub, YouTube) grâce à l'intelligence artificielle.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.5.14-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-06B6D4?logo=tailwindcss)

## ✨ Fonctionnalités

- 🔍 **Recherche intelligente multi-sources** : Interrogez simultanément Wikipedia, GitHub et YouTube
- 🎯 **Système de classement IA** : Résultats classés par pertinence grâce à un algorithme de ranking
- 💬 **Feedback utilisateur** : Système de votes (like/dislike) pour améliorer les résultats
- 🎨 **Interface moderne** : Design dark mode avec Tailwind CSS et animations fluides
- 📊 **Score de pertinence** : Visualisation du score de chaque résultat
- 🏷️ **Tags et métadonnées** : Affichage des mots-clés, auteurs, dates et sources
- 📝 **Résumés automatiques** : Aperçu du contenu sans quitter la page

## 🖼️ Captures d'écran

L'interface propose :
- Une barre de recherche centrale avec effet glassmorphism
- Des cartes de résultats avec scores circulaires
- Des badges colorés par type de source
- Un système de vote intuitif

## 🛠️ Technologies utilisées

- **React 18.2** - Framework JavaScript pour l'interface utilisateur
- **Vite** - Build tool ultra-rapide pour le développement
- **Tailwind CSS** - Framework CSS utility-first
- **Fetch API** - Communication avec le backend

## 📋 Prérequis

- Node.js >= 16.x
- npm ou yarn
- Backend EduRanker en cours d'exécution sur `http://127.0.0.1:8000`

## 🚀 Installation

1. **Cloner le dépôt**
```bash
git clone <votre-repo>
cd crawler-enduranker-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Crée une version optimisée pour la production |
| `npm run preview` | Prévisualise la version de production |

## ⚙️ Configuration

### API Backend

L'URL de l'API backend est configurée dans `src/App.jsx` :

```javascript
const API_BASE_URL = "http://127.0.0.1:8000";
```

Modifiez cette variable si votre backend est hébergé ailleurs.

### Paramètres de recherche

Les paramètres par défaut de la recherche peuvent être ajustés dans la fonction `poserQuestion()` :

```javascript
{
  question: question,
  max_par_site: 15,           // Nombre max de résultats par source
  sources: ["wikipedia", "github", "youtube"],  // Sources à interroger
  langues: ["fr", "en"],      // Langues de recherche
  top_k_faiss: 50,            // Top K pour FAISS
  top_k_final: 10             // Nombre final de résultats
}
```

## 🔌 API Endpoints utilisés

### POST `/api/workflow/process`
Envoie une question et récupère les résultats classés.

**Body :**
```json
{
  "question": "string",
  "max_par_site": 15,
  "sources": ["wikipedia", "github", "youtube"],
  "langues": ["fr", "en"],
  "top_k_faiss": 50,
  "top_k_final": 10
}
```

**Response :**
```json
{
  "resultats": [
    {
      "id_inference": "string",
      "titre": "string",
      "url": "string",
      "source": "string",
      "auteur": "string",
      "date": "string",
      "resume": "string",
      "mots_cles": ["string"],
      "score_final": 0.95
    }
  ]
}
```

### POST `/api/reranking/feedback`
Envoie un feedback (like/dislike) sur un résultat.

**Body :**
```json
{
  "inference_id": "string",
  "feedback_type": "like" | "dislike"
}
```

## 🎨 Structure du projet

```
crawler-enduranker-frontend/
├── index.html              # Point d'entrée HTML
├── package.json            # Dépendances et scripts
├── vite.config.mjs         # Configuration Vite
├── tailwind.config.cjs     # Configuration Tailwind
├── postcss.config.cjs      # Configuration PostCSS
└── src/
    ├── main.jsx            # Point d'entrée React
    ├── App.jsx             # Composant principal
    └── index.css           # Styles globaux
```

## 🎯 Composants principaux

### `App.jsx`
Composant principal qui gère :
- L'état de la recherche et des résultats
- La communication avec l'API
- Le système de votes
- L'affichage des résultats

### `SourceBadge`
Composant pour afficher des badges colorés selon la source :
- 💻 GitHub (gris foncé)
- 📚 Wikipedia (gris clair)
- ✍️ YouTube (jaune)

## 🎨 Personnalisation

### Couleurs et thème
Les couleurs sont configurées via Tailwind CSS. Le thème utilise principalement :
- Fond : `#0f172a` (slate-900)
- Cartes : `gray-900/60` avec backdrop-blur
- Accents : bleu (`blue-600`), émeraude (`emerald-600`)

### Animations
Les animations incluent :
- Transitions de recherche (scale et position)
- Effets de survol sur les cartes
- Spinners de chargement
- Effets de glassmorphism

## 🐛 Débogage

Pour voir les logs de communication avec l'API, ouvrez la console du navigateur (F12). Les votes sont loggés avec l'emoji 📤.

## 📝 Format des données

Chaque résultat doit contenir :
- `id_inference` : ID unique pour le feedback
- `titre` : Titre du document
- `url` : Lien vers la ressource
- `source` : Source (wikipedia, github, youtube)
- `score_final` : Score de pertinence (0-1)
- `auteur` (optionnel) : Auteur du contenu
- `date` (optionnel) : Date de publication
- `resume` / `description` / `snippet` (optionnel) : Résumé du contenu
- `mots_cles` (optionnel) : Tableau de mots-clés

## 🤝 Contribution

Ce projet fait partie du cours **INF5101 - Traitement multimédia des données** (Master 2 DS).

## 📄 Licence

Ce projet est développé dans un cadre académique.

## 👥 Auteurs

Projet réalisé dans le cadre du Master 2 Data Science.

---

⭐ **Astuce** : Pour une meilleure expérience, assurez-vous que le backend est bien démarré avant de lancer le frontend !
