// example.js (Version finale et robuste)

const { createStore, applyMiddleware, thunkMiddleware } = require('./index.js');
const mysql = require('mysql2/promise');
require('dotenv').config();

// --- 1. La Connexion à la Base de Données ---
// On met la création du pool dans un bloc try/catch pour mieux gérer les erreurs.
let dbPool;
try {
  dbPool = mysql.createPool(process.env.DB_URL);
  console.log('Connexion à la base de données initialisée...');
} catch (error) {
  console.error("ERREUR FATALE: Impossible de créer le pool de connexion.", error);
  process.exit(1); // On quitte le script si la connexion échoue
}

// --- 2. L'État Initial et le Reducer ---
// (Aucun changement ici)
const initialState = { users: { loading: false, data: [], error: null } };
function usersReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_USERS_REQUEST': return { ...state, users: { ...state.users, loading: true, error: null } };
    case 'FETCH_USERS_SUCCESS': return { ...state, users: { loading: false, data: action.payload, error: null } };
    case 'FETCH_USERS_FAILURE': return { ...state, users: { ...state.users, loading: false, error: action.payload } };
    default: return state;
  }
}

// --- 3. Création du Store ---
// (Aucun changement ici)
const store = createStore(usersReducer, applyMiddleware(thunkMiddleware));

// --- 4. L'Action Asynchrone ---
// (Aucun changement ici)
const fetchUsers = () => async (dispatch) => {
  dispatch({ type: 'FETCH_USERS_REQUEST' });
  try {
    const [users] = await dbPool.query('SELECT id, username, email, SC_balance, created_at FROM users');
    dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });
  } catch (error) {
    dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
  }
};

// --- 5. La NOUVELLE Simulation ---
// On englobe notre logique dans une fonction `async` pour pouvoir utiliser `await`.
async function runSimulation() {
  store.subscribe(() => {
    console.log('🔄 NOUVEL ÉTAT REÇU :', JSON.stringify(store.getState(), null, 2));
  });

  console.log('▶️ Lancement de l\'action pour récupérer les utilisateurs...');
  // On "await" la fin du dispatch. C'est une petite astuce pour s'assurer
  // que l'opération asynchrone a bien le temps de se faire.
  await store.dispatch(fetchUsers());

  // LA LIGNE LA PLUS IMPORTANTE :
  // On ferme proprement la connexion à la base de données.
  // Cela permet au script Node.js de se terminer naturellement.
  console.log('Tâche terminée. Fermeture de la connexion à la base de données.');
  await dbPool.end();
}

// On lance la simulation.
runSimulation();
