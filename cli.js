#!/usr/bin/env node

// La ligne ci-dessus est très importante ! Elle indique au terminal
// que ce fichier doit être exécuté avec Node.js.

const { program } = require('commander');
const chalk = require('chalk');
const mysql = require('mysql2/promise');
require('dotenv').config();

// On crée une fonction pour la connexion DB pour ne pas la répéter.
let dbPool;
function getDbPool() {
    if (!dbPool) {
        dbPool = mysql.createPool(process.env.DB_URL);
    }
    return dbPool;
}

// Description générale de notre robot
program
  .name('dragon-cli')
  .description('Un robot CLI pour interagir avec la base de données Dragon-Store.')
  .version('1.0.0');

// --- COMMANDE N°1 : Afficher les utilisateurs ---
program
  .command('show-users')
  .description('Affiche la liste de tous les utilisateurs dans la base de données.')
  .action(async () => {
    console.log(chalk.yellow('🐉 Récupération de la liste des utilisateurs...'));
    const pool = getDbPool();
    try {
        const [users] = await pool.query('SELECT id, username, email, SC_balance FROM users');
        
        if (users.length === 0) {
            console.log(chalk.blue('La base de données ne contient aucun utilisateur.'));
        } else {
            console.table(users); // Affiche les résultats dans un joli tableau !
        }
    } catch (error) {
        console.error(chalk.red('Erreur lors de la récupération des utilisateurs:'), error.message);
    } finally {
        await pool.end(); // On ferme toujours la connexion
        console.log(chalk.gray('Connexion fermée.'));
    }
  });

// --- COMMANDE N°2 : Ajouter un utilisateur ---
program
  .command('add-user <username> <email>')
  .description('Ajoute un nouvel utilisateur à la base de données.')
  .action(async (username, email) => {
    console.log(chalk.green(`🔥 Ajout de l'utilisateur '${username}' avec l'email '${email}'...`));
    const pool = getDbPool();
    try {
        // On utilise des '?' pour la sécurité (prévention d'injection SQL)
        const query = 'INSERT INTO users (username, email, password_hash, SC_balance) VALUES (?, ?, ?, ?)';
        const values = [username, email, 'default_password_hash', 0]; // Valeurs par défaut

        const [result] = await pool.query(query, values);
        
        console.log(chalk.greenBright.bold(`✅ Succès ! Utilisateur ajouté avec l'ID: ${result.insertId}`));
    } catch (error) {
        console.error(chalk.red('Erreur lors de l\'ajout de l\'utilisateur:'), error.message);
    } finally {
        await pool.end();
        console.log(chalk.gray('Connexion fermée.'));
    }
  });

// Cette ligne est essentielle, elle analyse les commandes que tu tapes
program.parse(process.argv);
