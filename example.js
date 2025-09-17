// example.js
const MGTManager = require('./index');
require('dotenv').config(); // Charge les variables de .env dans process.env

// Fonction principale asynchrone pour utiliser await
async function main() {
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    console.error("Veuillez définir votre token dans le fichier .env");
    return;
  }
  
  const manager = new MGTManager(hfToken);

  try {
    // ---- Scénario 1 : Utilisation correcte ----
    console.log("--- Début du scénario 1 ---");
    manager.acquireModel('Mistral-7B-Instruct-v0.3');
    console.log("Modèle actif :", manager.getActiveModel().name);

    const prompt = "Explique la relativité générale en trois phrases.";
    console.log(`\nEnvoi du prompt : "${prompt}"`);
    const result = await manager.runInference(prompt);
    console.log("\nRéponse du modèle :\n", result);
    
    manager.releaseModel();
    console.log("Modèle actif après libération :", manager.getActiveModel());
    console.log("--- Fin du scénario 1 ---\n");


    // ---- Scénario 2 : Tentative d'acquérir un second modèle ----
    console.log("--- Début du scénario 2 ---");
    manager.acquireModel('Mixtral-8x7B-Instruct-v0.1');
    try {
      // Cette ligne va provoquer une erreur, car un modèle est déjà actif
      manager.acquireModel('Mistral-7B-Instruct-v0.3');
    } catch (error) {
      console.error("Erreur attendue :", error.message);
    }
    manager.releaseModel();
    console.log("--- Fin du scénario 2 ---");

  } catch (error) {
    console.error("\nUne erreur inattendue est survenue :", error);
  }
}

main();
