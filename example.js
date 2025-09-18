// example.js (Version avec débogage)

const { createStore, applyMiddleware, thunkMiddleware } = require('./index.js');
const mysql = require('mysql2/promise');
require('dotenv').config();

let dbPool;
try {
  dbPool = mysql.createPool(process.env.DB_URL);
  console.log('Connexion à la base de données initialisée...');
} catch (error) {
  console.error("ERREUR FATALE: Impossible de créer le pool de connexion.", error);
  process.exit(1);
}

const initialState = { users: { loading: false, data: [], error: null } };
function usersReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_USERS_REQUEST': return { ...state, users: { ...state.users, loading: true, error: null } };
    case 'FETCH_USERS_SUCCESS': return { ...state, users: { loading: false, data: action.payload, error: null } };
    case 'FETCH_USERS_FAILURE': return { ...state, users: { ...state.users, loading: false, error: action.payload } };
    default: return state;
  }
}

const store = createStore(usersReducer, applyMiddleware(thunkMiddleware));

// On modifie juste cette fonction pour y ajouter un console.log
const fetchUsers = () => async (dispatch) => {
  dispatch({ type: 'FETCH_USERS_REQUEST' });
  try {
    const [users] = await dbPool.query('SELECT id, username, email, SC_balance, created_at FROM users');
    
    // ----------- LA PREUVE EST ICI -----------
    console.log(`[DEBUG] La base de données a retourné ${users.length} utilisateurs.`);
    // -----------------------------------------

    dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });
  } catch (error) {
    console.error('[DEBUG] Une erreur est survenue pendant la requête :', error);
    dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
  }
};

async function runSimulation() {
  store.subscribe(() => {
    console.log('🔄 NOUVEL ÉTAT REÇU :', JSON.stringify(store.getState(), null, 2));
  });

  console.log('▶️ Lancement de l\'action pour récupérer les utilisateurs...');
  await store.dispatch(fetchUsers());

  console.log('Tâche terminée. Fermeture de la connexion à la base de données.');
  await dbPool.end();
}

runSimulation();
