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
