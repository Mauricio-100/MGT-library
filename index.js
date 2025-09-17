// index.js

/**
 * Crée un Store qui contient l'état complet de l'application.
 * Il n'y a qu'un seul Store dans une application Redux.
 * @param {Function} reducer Une fonction qui retourne le prochain état, en fonction de l'état précédent et d'une action.
 */
function createStore(reducer) {
  // --- Pilier 1 : La Source Unique de Vérité ---
  // L'état est une variable privée, accessible uniquement via getState().
  let state;
  let listeners = []; // Une liste des fonctions à appeler quand l'état change

  // La seule façon de LIRE l'état.
  function getState() {
    return state;
  }

  // --- Pilier 2 : L'État est en Lecture Seule ---
  // La seule façon de MODIFIER l'état est de "dispatcher" une action.
  function dispatch(action) {
    // On passe l'état actuel et l'action au reducer...
    // ...pour qu'il calcule le NOUVEL état.
    // C'est ici que l'on applique le Pilier 3 (Fonctions Pures).
    state = reducer(state, action);

    // On prévient tous les "abonnés" qu'un changement a eu lieu.
    listeners.forEach(listener => listener());
  }

  // Permet à l'UI (ou autre) de s'abonner aux changements du Store.
  // Chaque fois que dispatch est appelé, la fonction "listener" sera exécutée.
  function subscribe(listener) {
    listeners.push(listener);

    // Retourne une fonction pour se désabonner, c'est une bonne pratique.
    return function unsubscribe() {
      listeners = listeners.filter(l => l !== listener);
    };
  }
  
  // Au démarrage, on dispatche une action "INIT" pour que le reducer
  // retourne l'état initial de l'application.
  dispatch({ type: '@@DRAGON_STORE/INIT' });

  // On retourne l'API publique de notre Store.
  return {
    getState,
    dispatch,
    subscribe
  };
}

// On exporte notre fonction pour qu'elle puisse être utilisée ailleurs.
module.exports = { createStore };
