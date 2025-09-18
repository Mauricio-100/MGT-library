<div align="center">

```
                  _                               _ 
                 | |                             | |
  _ __ ___   __ _| | _____  __      _____  _ __ __| |
 | '_ ` _ \ / _` | |/ / _ \ \ \ /\ / / _ \| '__/ _` |
 | | | | | | (_| |   <  __/  \ V  V / (_) | | | (_| |
 |_| |_| |_|\__,_|_|\_\___|   \_/\_/ \___/|_|  \__,_|
                                                    
```

# Dragon-CLI 🐉

**Forgez et commandez votre base de données directement depuis le terminal.**

</div>

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/dragon-cli-tool.svg)](https://www.npmjs.com/package/dragon-cli-tool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM Downloads](https://img.shields.io/npm/dt/dragon-cli-tool.svg)](https://www.npmjs.com/package/dragon-cli-tool)
[![Code Style: Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

</div>

---

**Dragon-CLI** n'est pas juste un outil, c'est une philosophie. Né de l'étude des principes de gestion d'état les plus robustes (comme Redux), ce robot a été conçu pour apporter ordre, clarté et puissance à la tâche la plus fondamentale : l'interaction avec vos données.

Fini le chaos des interfaces graphiques lourdes ou des scripts SQL désorganisés. Avec Dragon-CLI, vous disposez d'une interface en ligne de commande propre, rapide et colorée pour maîtriser votre base de données utilisateurs.

## 🔥 Les Pouvoirs du Dragon

*   **Gestion d'Utilisateurs Intuitive :** Affichez et ajoutez des utilisateurs avec des commandes simples et mémorables.
*   **Affichage Clair et Structuré :** La commande `show-users` présente vos données dans un tableau propre et lisible, directement dans votre console.
*   **Sécurité Intégrée :** Les commandes de création utilisent des requêtes préparées pour prévenir les risques d'injection SQL.
*   **Configuration Simplifiée :** Un seul fichier `.env` pour stocker vos secrets de connexion. Le robot s'occupe du reste.
*   **Interface Colorée :** Des retours visuels clairs grâce à `chalk` pour savoir immédiatement si une commande a réussi ou échoué.
*   **Zéro Dépendance Superflue :** Un outil léger et focalisé sur sa mission.

## 🛠️ Prérequis

Avant de pouvoir déchaîner le dragon, assurez-vous d'avoir :

1.  **Node.js et NPM :** Version 14.x ou supérieure. [Installez-les ici](https://nodejs.org/).
2.  **Une Base de Données MySQL :** L'outil est conçu pour une table `users` spécifique.
3.  **L'URL de Connexion :** Votre chaîne de connexion complète à la base de données.

La table `users` attendue doit avoir au minimum les colonnes suivantes : `id`, `username`, `email`, `password_hash`, `SC_balance`.

## 🚀 Installation

L'installation se fait globalement via NPM, ce qui rend la commande `dragon-cli` accessible de n'importe où dans votre terminal.

```bash
npm install -g dragon-cli-tool
```
*(Note : le nom du paquet est un exemple, remplacez-le par le vrai nom que vous choisirez sur NPM)*

## ⚙️ Configuration : Le Souffle du Dragon

Le robot a besoin de connaître l'adresse secrète de votre base de données. Pour cela, vous devez créer un fichier `.env` dans le dossier **à partir duquel vous allez lancer les commandes**.

1.  Créez un fichier nommé `.env`.
2.  Ajoutez-y une seule ligne, en remplaçant les informations par les vôtres :

    ```env
    DB_URL="mysql://VOTRE_USER:VOTRE_MOT_DE_PASSE@VOTRE_HOTE:VOTRE_PORT/VOTRE_BASE_DE_DONNEES"
    ```

**Exemple de fichier `.env` :**
```env
DB_URL="mysql://avnadmin:AVNS_xxxxxxxxxxxx@mysql-1a36101-botwii.c.aivencloud.com:14721/defaultdb"
```
**La sécurité de ce fichier est votre responsabilité. Ajoutez-le toujours à votre `.gitignore` !**

## 📖 Le Grimoire des Commandes

Voici les commandes pour maîtriser votre robot.

### `dragon-cli show-users`

Affiche la liste complète de tous les utilisateurs présents dans la base de données dans un tableau formaté.

**Usage :**
```bash
dragon-cli show-users
```

**Résultat Attendu :**
```console
🐉 Récupération de la liste des utilisateurs...
┌────┬──────────┬────────────────────────┬────────────┐
│ id │ username │ email                  │ SC_balance │
├────┼──────────┼────────────────────────┼────────────┤
│ 1  │ Mauricio │ mauricio@example.com   │ 500        │
│ 2  │ Alice    │ alice@example.com      │ 1200       │
└────┴──────────┴────────────────────────┴────────────┘
Connexion fermée.
```

---

### `dragon-cli add-user <username> <email>`

Ajoute un nouvel utilisateur à la base de données avec des valeurs par défaut pour les autres champs.

**Usage :**```bash
dragon-cli add-user "SuperDidi" "didi@dragon.com"
```

**Résultat Attendu :**
```console
🔥 Ajout de l'utilisateur 'SuperDidi' avec l'email 'didi@dragon.com'...
✅ Succès ! Utilisateur ajouté avec l'ID: 3
Connexion fermée.
```

---

## 🐲 La Philosophie Derrière le Dragon

Ce projet est né d'une idée simple : la meilleure façon de maîtriser un concept est de le construire. Inspiré par les **trois piliers de Redux**, ce CLI applique la même rigueur à la gestion de données en ligne de commande :

1.  **Source Unique de Vérité :** Votre base de données MySQL est le "Store" central et incontestable.
2.  **L'État est en Lecture Seule :** Vous ne modifiez pas les données directement. Vous émettez des **Actions** (nos commandes CLI) qui décrivent une intention de changement.
3.  **Modifications par Fonctions Pures :** Chaque commande exécute une logique isolée et prédictible (le "Reducer") qui transforme l'intention en une transaction SQL sécurisée.

En utilisant Dragon-CLI, vous n'utilisez pas seulement un outil, vous pratiquez une architecture logicielle saine et éprouvée.

## 🤝 Contribuer

Ce projet est ouvert aux contributions ! N'hésitez pas à ouvrir une issue pour signaler un bug ou proposer une nouvelle fonctionnalité. Veuillez lire notre [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) avant de participer.

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---
<div align="center">
  <i>Forgé avec passion et Node.js.</i>
</div>
