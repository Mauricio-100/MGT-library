// index.js
const { HfInference } = require("@huggingface/inference");

// Le catalogue des modèles supportés par notre bibliothèque
const SUPPORTED_MODELS = {
  'Mistral-7B-Instruct-v0.3': 'mistralai/Mistral-7B-Instruct-v0.3',
  'Mixtral-8x7B-Instruct-v0.1': 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  // Ajoutez ici les autres modèles de votre liste
   'Llama-3.1-8B-Instruct': 'meta-llama/Meta-Llama-3.1-8B-Instruct',
   'Gemma-7B': 'google/gemma-7b',
};

class MGTManager {
  #hf; // Instance privée de HfInference
  #activeModelSession = null; // Garde en mémoire le modèle actuellement "loué"

  /**
   * Initialise le gestionnaire avec un token d'accès Hugging Face.
   * @param {string} accessToken - Votre token Hugging Face.
   */
  constructor(accessToken) {
    if (!accessToken) {
      throw new Error("Le token d'accès Hugging Face est requis.");
    }
    this.#hf = new HfInference(accessToken);
  }

  /**
   * Acquiert un verrou sur un modèle pour l'utiliser.
   * @param {string} modelName - Le nom convivial du modèle (ex: 'Mistral-7B-Instruct-v0.3').
   */
  acquireModel(modelName) {
    if (this.#activeModelSession) {
      throw new Error(`Un modèle est déjà actif: '${this.#activeModelSession.name}'. Veuillez le libérer avec releaseModel() avant d'en acquérir un nouveau.`);
    }

    const repoId = SUPPORTED_MODELS[modelName];
    if (!repoId) {
      throw new Error(`Le modèle '${modelName}' n'est pas supporté par cette bibliothèque.`);
    }

    this.#activeModelSession = {
      name: modelName,
      repoId: repoId,
      acquiredAt: new Date()
    };

    console.log(`Modèle '${modelName}' acquis avec succès.`);
    return this.#activeModelSession;
  }

  /**
   * Libère le modèle actuellement actif.
   */
  releaseModel() {
    if (!this.#activeModelSession) {
      console.warn("Aucun modèle n'est actuellement actif.");
      return;
    }

    const modelName = this.#activeModelSession.name;
    this.#activeModelSession = null;
    console.log(`Modèle '${modelName}' libéré.`);
  }

  /**
   * Exécute une inférence de génération de texte sur le modèle actif.
   * @param {string} prompt - Le texte d'entrée pour le modèle.
   * @returns {Promise<string>} La réponse générée par le modèle.
   */
  async runInference(prompt) {
    if (!this.#activeModelSession) {
      throw new Error("Aucun modèle n'a été acquis. Veuillez utiliser acquireModel() d'abord.");
    }

    try {
      const response = await this.#hf.textGeneration({
        model: this.#activeModelSession.repoId,
        inputs: prompt,
      });
      return response.generated_text;
    } catch (error) {
      console.error(`Erreur lors de l'inférence sur le modèle ${this.#activeModelSession.name}:`, error);
      throw error;
    }
  }

  /**
   * Retourne des informations sur la session active.
   * @returns {object|null} L'objet de la session active ou null.
   */
  getActiveModel() {
    return this.#activeModelSession;
  }
}

// Exporter la classe pour qu'elle soit utilisable
module.exports = MGTManager;
