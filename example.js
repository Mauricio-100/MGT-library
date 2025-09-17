// example.js

const { createStore } = require('./index.js');

// --- Le Comptable (Le Reducer) ---
// C'est une fonction pure. Pour un état et une action donnés, elle retourne
// TOUJOURS le même nouvel état, sans aucun effet de bord.
// state = 0 est la valeur par défaut pour l'état initial.
function counterReducer(state = 0, action) {
  console.log(`Le reducer a reçu l'état '${state}' et l'action '${action.type}'`);
  
  switch (action.type) {
    case 'INCREMENT':
      return state + 1; // On retourne une NOUVELLE valeur
    case 'DECREMENT':
      return state - 1;
    default:
      return state; // Pour toute autre action, on ne change rien
  }
}

// --- Le Grand Livre de Comptes (Le Store) ---
// On crée notre store en lui donnant notre "comptable".
const store = createStore(counterReducer);

// --- L'Afficheur (Notre "Interface Utilisateur") ---
// C'est une fonction qui lit l'état et l'affiche.
// Dans une vraie application, ce serait une librairie comme React ou Vue.
function render() {
  const currentState = store.getState();
  console.log(`----------------------------------`);
  console.log(`🔄 L'état a changé ! Nouvelle valeur : ${currentState}`);
  console.log(`----------------------------------\n`);
}

// --- L'Abonnement ---
// On dit au store : "Hé, chaque fois que l'état change, exécute la fonction render".
store.subscribe(render);

// --- Le Début de la Danse ---
console.log("🚀 Début de la simulation. L'état initial est déjà défini.\n");
render(); // On affiche l'état initial

console.log("▶️ Dispatch de l'action : INCREMENT");
store.dispatch({ type: 'INCREMENT' }); // L'UI déclenche une action

console.log("▶️ Dispatch de l'action : INCREMENT");
store.dispatch({ type: 'INCREMENT' });

console.log("▶️ Dispatch de l'action : DECREMENT");
store.dispatch({ type: 'DECREMENT' });
