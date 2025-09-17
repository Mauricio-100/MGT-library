# MGT-library (Model Gated Token Library)

[![NPM Version](https://img.shields.io/npm/v/mgt-library.svg)](https://www.npmjs.com/package/mgt-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MGT-library est un gestionnaire de modèles IA pour Node.js qui simplifie l'accès à une sélection de modèles de pointe de Hugging Face. Il est conçu autour d'un principe simple : **un seul modèle à la fois**. Grâce à un système de "leasing" (acquisition/libération), vous pouvez vous assurer que vos ressources sont utilisées de manière contrôlée et prévisible.

## Concept Clé

La bibliothèque utilise un seul token d'authentification Hugging Face pour interagir avec un catalogue prédéfini de modèles. Avant d'utiliser un modèle pour l'inférence, vous devez l'« acquérir ». Une fois vos tâches terminées, vous devez le « libérer » pour pouvoir en utiliser un autre. Cela empêche les appels parallèles non désirés et clarifie quel modèle est utilisé à un instant T.

## Fonctionnalités

-   **Authentification Unique** : Initialisez le gestionnaire une seule fois avec votre token Hugging Face.
-   **Catalogue de Modèles Intégré** : Accédez facilement aux modèles populaires comme Mistral, Mixtral, Gemma, et Llama 3.1.
-   **Système de Leasing Exclusif** : Le mécanisme `acquireModel()` / `releaseModel()` garantit qu'un seul modèle est actif à la fois.
-   **Interface d'Inférence Simple** : Une méthode `runInference()` unifiée pour interagir avec le modèle actif.

## Prérequis

Vous devez posséder un **token d'accès Hugging Face** avec des droits d'accès aux modèles que vous souhaitez utiliser.

1.  Créez un compte sur [Hugging Face](https://huggingface.co/join).
2.  Générez un token d'accès dans vos [paramètres](https://huggingface.co/settings/tokens).

## Installation

```bash
npm install mgt-library```
```
## Démarrage Rapide

1.  Créez un fichier `.env` à la racine de votre projet pour stocker votre token en toute sécurité :

    ```
    # .env
    HF_TOKEN="hf_votre_token_secret_ici"
    ```

2.  **Important** : Ajoutez `.env` à votre fichier `.gitignore` pour ne jamais exposer votre token.

3.  Utilisez le gestionnaire dans votre code :

    ```javascript
    const MGTManager = require('mgt-library');
    require('dotenv').config(); // Charge les variables du fichier .env

    async function main() {
      const manager = new MGTManager(process.env.HF_TOKEN);
    
      try {
        // Étape 1 : Acquérir un modèle
        manager.acquireModel('Mistral-7B-Instruct-v0.3');
        console.log(`Modèle actif : ${manager.getActiveModel().name}`);

        // Étape 2 : Lancer une inférence
        const prompt = "Quelle est la capitale de la France ?";
        console.log(`\nEnvoi du prompt : "${prompt}"`);
        
        const result = await manager.runInference(prompt);
        console.log("\nRéponse du modèle :", result);

      } catch (error) {
        console.error("Une erreur est survenue :", error.message);
      } finally {
        // Étape 3 : Toujours libérer le modèle, même en cas d'erreur
        manager.releaseModel();
        console.log("\nSession terminée. Modèle libéré.");
      }
    }

    main();
    ```
    ```
---------
| ## API|
---------
-   `new MGTManager(accessToken)` : Crée une nouvelle instance du gestionnaire.
-   `acquireModel(modelName)` : Verrouille un modèle du catalogue pour utilisation. Lance une erreur si un modèle est déjà actif.
-   `releaseModel()` : Libère le modèle actuellement actif.
-   `runInference(prompt)` : Exécute une tâche de génération de texte sur le modèle actif.
-   `getActiveModel()` : Retourne des informations sur le modèle actuellement acquis, ou `null`.

## Contribuer
-------------------------------------
Les contributions sont les bienvenues ! Veuillez lire notre [Code de Conduite](CODE_OF_CONDUCT.md) avant de participer.

## Licence
-------------------------------------
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
