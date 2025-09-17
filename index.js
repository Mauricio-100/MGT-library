// index.js (version améliorée)

// La fonction applyMiddleware est un "enhancer" de store.
// Elle prend le middleware et retourne une fonction qui prend createStore.
function applyMiddleware(middleware) {
  return function(createStore) {
    return function(reducer) {
      const store = createStore(reducer);
      let dispatch = store.dispatch; // On garde une référence au dispatch original

      // On prépare une API pour le middleware
      const middlewareAPI = {
        getState: store.getState,
        // Le dispatch que le middleware verra...
        // ... sera une version qui relance le cycle complet.
        dispatch: (action) => dispatch(action) 
      };

      // On passe l'API au middleware, qui nous retourne une version "améliorée"
      // de la fonction dispatch.
      dispatch = middleware(middlewareAPI)(store.dispatch);

      // On retourne le store, mais on remplace son dispatch par notre
      // version améliorée qui passe d'abord par le middleware.
      return {
        ...store,
        dispatch
      };
    }
  }
}

function createStore(reducer) {
  // ... (le code de createStore reste le même qu'avant) ...
  let state;
  let listeners = [];
  function getState() { return state; }
  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }
  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      listeners = listeners.filter(l => l !== listener);
    };
  }
  dispatch({ type: '@@DRAGON_STORE/INIT' });
  return { getState, dispatch, subscribe };
}

module.exports = { createStore, applyMiddleware };
// index.js (à la fin)
// Notre premier middleware !
function thunkMiddleware({ dispatch, getState }) {
  return function(next) {
    return function(action) {
      // Si l'action est une fonction (un "thunk")...
      if (typeof action === 'function') {
        // ...on l'exécute en lui donnant accès à dispatch et getState.
        // C'est ici que la magie asynchrone se produit.
        return action(dispatch, getState);
      }
      // Sinon, c'est une action normale, on la laisse passer au reducer.
      return next(action);
    };
  };
}

module.exports = { createStore, applyMiddleware, thunkMiddleware };```

#### Étape 4 : Le Chef-d'œuvre - `example.js` avec la Base de Données

Ce fichier va tout rassembler.

```javascript
// example.js

const { createStore, applyMiddleware, thunkMiddleware } = require('./index.js');
const mysql = require('mysql2/promise');
require('dotenv').config(); // Pour charger le .env

// --- 1. La Connexion à la Base de Données ---
const dbPool = mysql.createPool(process.env.DB_URL);
console.log('Connexion à la base de données initialisée...');

// --- 2. L'État Initial et le Reducer ---
const initialState = {
  users: {
    loading: false,
    data: [],
    error: null
  }
};

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
const store = createStore(
  usersReducer,
  applyMiddleware(thunkMiddleware) // On applique notre "inspecteur" asynchrone
);

// --- 4. L'Action Asynchrone (Le "Thunk") ---
// Ce n'est pas un objet, mais une fonction ! Le middleware va l'intercepter.
const fetchUsers = () => {
  return async (dispatch) => {
    // Étape A: On prévient l'UI qu'on commence à charger
    dispatch({ type: 'FETCH_USERS_REQUEST' });
    
    try {
      // Étape B: On fait l'appel à la base de données
      const [rows] = await dbPool.query('SELECT 1 as id, "test_user" as name'); // Remplace par une vraie table
      
      // Étape C: Si ça réussit, on envoie les données à l'UI
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: rows });
    } catch (error) {
      // Étape D: Si ça échoue, on envoie l'erreur
      dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
    }
  };
};

// --- 5. La Simulation ---
store.subscribe(() => {
  console.log('🔄 NOUVEL ÉTAT REÇU :', JSON.stringify(store.getState(), null, 2));
});

console.log('▶️ Lancement de l\'action asynchrone pour récupérer les utilisateurs...');
store.dispatch(fetchUsers());
