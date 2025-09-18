// example.js (Version finale adaptée à TA table)

const { createStore, applyMiddleware, thunkMiddleware } = require('./index.js');
const mysql = require('mysql2/promise');
require('dotenv').config();

// --- 1. La Connexion à la Base de Données ---
// (Aucun changement ici, elle utilise ton .env)
const dbPool = mysql.createPool(process.env.DB_URL);
console.log('Connexion à la base de données initialisée...');

// --- 2. L'État Initial et le Reducer ---
// On définit la forme de notre état pour correspondre aux données de la DB.
const initialState = {
  users: {
    loading: false,
    data: [],
    error: null
  }
};

// Ce reducer est assez intelligent pour fonctionner sans modification !
function usersReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_USERS_REQUEST':
      return { ...state, users: { ...state.users, loading: true, error: null } };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, users: { loading: false, data: action.payload, error: null } };
    case 'FETCH_USERS_FAILURE':
      return { ...state, users: { ...state.users, loading: false, error: action.payload } };
    default:
      return state;
  }
}

// --- 3. Création du Store AVEC le Middleware ---
// (Aucun changement ici)
const store = createStore(
  usersReducer,
  applyMiddleware(thunkMiddleware)
);

// --- 4. L'Action Asynchrone (Le "Thunk") MISE À JOUR ---
const fetchUsers = () => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_USERS_REQUEST' });
    
    try {
      // LA LIGNE QUI CHANGE : On utilise la nouvelle requête sécurisée !
      const [users] = await dbPool.query('SELECT id, username, email, SC_balance, created_at FROM users');
      
      // On envoie les utilisateurs récupérés dans le payload.
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
    }
  };
};

// --- 5. La Simulation ---
store.subscribe(() => {
  console.log('🔄 NOUVEL ÉTAT REÇU :', JSON.stringify(store.getState(), null, 2));
});

console.log('▶️ Lancement de l\'action pour récupérer les utilisateurs depuis la VRAIE table...');
store.dispatch(fetchUsers());
