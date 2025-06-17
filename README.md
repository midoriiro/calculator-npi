## 1️⃣ Présentation générale

### 📌 Titre du projet

**NPI Calculator API & UI**  
_Une application complète de calcul en Notation Polonaise Inverse (NPI), avec API REST, interface web et export CSV._

### 📌 Brève description de l’application

Ce projet propose une application full-stack permettant aux utilisateurs d’effectuer des calculs en **notation polonaise inverse (NPI)**, d'en conserver l’historique et de l’exporter sous forme de fichier CSV.

Le projet comprend :

- **Une API REST** développée en Python avec [FastAPI](https://fastapi.tiangolo.com/).
- **Une interface web** développée en [React](https://react.dev/) avec [Material-UI](https://mui.com/).
- **Une base de données PostgreSQL** pour stocker l’historique des opérations.
- Un environnement de développement conteneurisé avec **Podman Compose** et **DevContainer**.

Le projet est facilement exécutable en local avec Podman ou via un environnement de développement DevContainer dans VSCode.

### 📌 Fonctionnement général de l’application (NPI Calculator → API + UI)

#### 🎛️ UI (Interface Web)

- **Saisie des expressions NPI** :
  - Support de la saisie **au clavier** ou **via l’interface graphique type calculatrice**.
  - Prise en charge des **nombres entiers** et **flottants**.
  - Opérateurs supportés : `+`, `-`, `*`, `/`.
  - Saisie particulière : pour entrer un **"." (séparateur décimal)** via l'UI, un double-clic sur le bouton `.` est nécessaire (détail ergonomique à noter).

- **Historique des opérations (UI)** :
  - Visualisation complète de l’historique.
  - Possibilité de **cliquer sur un nombre** (résultat ou opérande) pour l’injecter dans l’expression en cours.
  - Possibilité de **copier l’expression** complète au presse-papiers.
  - Possibilité de **réinjecter toute l’opération** dans le champ d’expression.

- **Gestion du CSV** :
  - Visualisation de l’export CSV dans l’interface.
  - Téléchargement du fichier CSV.

- **Nettoyage** :
  - Nettoyage de l’historique via l'UI (opération déclenchée à la fois côté UI et via l'API).

#### 🔄 API REST

- **Parser NPI** :
  - Traitement et parsing complet des expressions en notation polonaise inverse.
  - Validation et calcul des opérations.

- **Stockage** :
  - Sauvegarde de chaque opération avec son résultat dans la base de données.

- **Export** :
  - Route API dédiée pour **exporter l’historique au format CSV**.

- **Nettoyage** :
  - Route API pour nettoyer l’historique.

#### 📁 Fonctionnalités clés résumées

- ✅ Parser de NPI (API)
- ✅ Pseudo-parser (UI) pour prévalider l’expression
- ✅ Calcul des opérations (API)
- ✅ Stockage de l’historique des opérations (API + UI)
- ✅ Export des opérations au format CSV (API)
- ✅ Visualisation et téléchargement du fichier CSV (UI)
- ✅ Nettoyage des opérations (UI + API)
- ✅ Historique interactif dans l'UI avec :
  - Injection partielle ou totale d’opérations dans le champ d’expression
  - Copie au presse-papiers

## 2️⃣ Architecture du projet

### 📌 Mini schéma d’architecture (texte)

```
+----------------------+ +-----------------------+
|                      | |                       |
| Interface UI | <----------> | API REST         |
| (React + MaterialUI) | |     (FastAPI)         |
|                      | |                       |
+----------------------+ +-----------+-----------+
|
|
v
+-----------------------+
| PostgreSQL            |
| Historique des        |
| opérations            |
+-----------------------+
```


**Description :**

- L'**interface utilisateur** en React interagit directement avec l'**API REST** via des appels HTTP.
- L'**API REST** gère la logique métier, le parsing et le calcul des expressions en NPI.
- Les résultats et les opérations sont stockés dans une base de données **PostgreSQL**.
- L'application est conteneurisée et orchestrée à l’aide de **Podman Compose**.
- Un environnement de développement est fourni via **VSCode DevContainer** pour faciliter l'onboarding et la configuration locale.

---

### 📌 Stack technique

| Composant         | Technologie / Outil | Version utilisée (ou minimale recommandée)   |
|-------------------|---------------------|----------------------------------------------|
| Backend API       | Python + FastAPI    | Python 3.13.3 + FastAPI 0.104.1              |
| Frontend UI       | React + Material-UI | React 19.1.0 + Material-UI 7.1.1.            |
| Base de données   | PostgreSQL          | PostgreSQL 17.                               |
| Conteneurs        | Podman              | 5.5.1.                                       |
| Orchestration     | Podman Compose      | 1.4.0                                      |
| Dev Environnement | VSCode DevContainer | Dernière version du plugin Remote Containers |

**⚠️ Remarque :**

Si jamais la personne qui revoit le code ne parvient pas à utiliser le DevContainer (en particulier avec Podman rootless), il est recommandé de vérifier les versions ci-dessus et d’adapter au besoin en utilisant Docker Compose, qui est théoriquement compatible avec cette configuration.

## 3️⃣ Prérequis

### 🐳 Conteneurisation

- **Podman** version >= 5.5.1
- **Podman Compose** version >= 1.4.0
- Idéalement un OS Fedora Silverblue 42 à jour 

_Le projet a été testé avec Podman. Il devrait fonctionner également avec Docker / Docker Compose, mais cela n’a pas été explicitement validé._  
_Si vous utilisez Docker, adaptez le fichier [container-compose.yml](./container-compose.yml) au besoin (notamment les différences de comportement éventuelles sur le support des variables d'environment (build et runtime))._  

### 🖥️ Environnement de développement

- **Visual Studio Code (VSCode)** avec l'extension officielle **Remote - Containers** :
  - [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- Une configuration d’hôte permettant l'exécution de conteneurs **rootless** :
  - Socket Podman exposé en TCP (`tcp://abcd:wxyz`).  
  _⚠️ Le support de descripteur de socket (```unix:///```, ```pipe:///```, etc) n'est pas pris en charge dans ce projet._

_Le fichier [.devcontainer.json](./.devcontainer/devcontainer.json) est fourni pour simplifier la mise en place de l’environnement dans VSCode._  
_⚠️ L'usage du mode rootless est recommandé pour éviter les permissions root dans le container de développement._

## 5️⃣ Lancer le projet manuellement avec Podman Compose

### 🛠️ Commande pour builder le projet

```bash
compose --env-file .env.dev build
```

Vous pouvez également utiliser la tâche VSCode dédiée :
```
Tasks → Compose: Rebuild
```

🚀 Commande pour lancer le projet
```bash
compose --env-file .env.dev up
```

Vous pouvez également utiliser la tâche VSCode dédiée :
```
Tasks → Compose: Up
```
🌐 Accès aux services:
  - API: http://localhost:8000
      Documentation OpenAPI interactive : http://localhost:8000/docs
  - UI: http://localhost:9000


🚦 Vérification de l'état de l'API

Une tâche VSCode ``Compose: Wait for API`` est également disponible. Elle utilise un curl sur le endpoint ``/health`` pour valider que l'API est bien démarrée avant de lancer les tests d'intégration.

📝 Notes complémentaires
Le fichier [tasks.json](./.vscode/tasks.json) fournit plusieurs commandes automatisées pour simplifier le build et l'exécution des services (voir section dédiée).

Le mode ``Rebuild (no cache)`` est également disponible pour forcer un rebuild complet
```
Tasks → Compose: Rebuild (no cache)
```
ou en ligne de commande :
```bash
compose --env-file .env.dev build --no-cache
```

## 6️⃣ Commandes utiles via VSCode `tasks.json`

Le fichier [`tasks.json`](./.vscode/tasks.json) fournit plusieurs tâches automatisées permettant de simplifier l'utilisation du projet depuis Visual Studio Code.

Ces tâches peuvent être lancées via :
- le menu `Terminal` → `Run Task...`
- ou en utilisant la palette de commandes (`F1` → `Tasks: Run Task`)

### 🧪 Tests
Lancer les tests unitaires :
```
Tasks → API: Run Unit Tests
```
Lancer les tests unitaires avec couverture :
```
Tasks → API: Run Unit Tests with Coverage
```
Lancer les tests d’intégration :
```
Tasks → API: Run Integration Tests
```
Lancer les tests d’intégration avec nettoyage (flow complet avec compose) :
```
Tasks → API: Run Integration Tests with Cleanup
```
🐳 Tâches relatives à Compose
Builder l'ensemble des services :
```
Tasks → Compose: Rebuild
```
Builder sans cache :
```
Tasks → Compose: Rebuild (no cache)
```
Lancer l'ensemble des services :
```
Tasks → Compose: Up
```
Lancer les services en mode test (en détaché) :
```
Tasks → Compose: Up (test environment)
```
Arrêter et nettoyer les services :
```
Tasks → Compose: Down
```
Attendre que l'API soit disponible (healthcheck) :
```
Tasks → Compose: Wait for API
```
🏗️ Builder l'API
Installer les dépendances de l'API :
```
Tasks → API: Install Dependencies
```
Lancer l'API localement (mode reload) :
```
Tasks → API: Run API
```
Formatter le code :
```
Tasks → API: Format Code
```
Linter le code :
```
Tasks → API: Lint Code
```
Et d'autres relative a la gestion de projet avec Poetry.

📄 Documentation OpenAPI
La documentation interactive de l'API est disponible sur le endpoint suivant : [http://localhost:8000/docs](http://localhost:8000/docs)

## 7️⃣ Variables d’environnement

### 🗂️ Organisation des fichiers `.env`

Le projet utilise plusieurs fichiers `.env` pour la gestion de la configuration :

- `.env.dev` : configuration pour le développement local et l'exécution de Compose en mode standard.
- `.env.test` : configuration spécifique utilisée pour les tests d'intégration, via la tâche `Compose: Up (test environment)`.

Ces fichiers permettent de différencier les paramètres entre les environnements de développement et de test.

---

### 🌐 Utilisation de `API_URL` via ARG dans le build

Lors du build de l'interface utilisateur (UI React), la variable `API_URL` est injectée via un argument de build :

```dockerfile
ARG API_URL
RUN echo "API_URL=${API_URL}" > .env && npm run build
```

Cela permet de configurer dynamiquement l'adresse de l'API REST selon l'environnement cible (développement, test, production), sans nécessiter de fichier .env embarqué dans l'image de l'UI.
Cette approche garantit que la variable est bien figée au moment du build et évite d'exposer des fichiers de configuration sensibles dans l'image finale. Idéalement, une gestion plus robuste des variables d'environnement et des secrets (ex: via un vault ou un mécanisme sécurisé de CI/CD) serait préférable. Par manque de temps, cette gestion n'a pas été mise en place ici.

### 🖥️ Fichier /workspace/ui/.env.dev

En développement local (via npm run dev ou dans le DevContainer), le fichier /workspace/ui/.env.dev est utilisé par React pour configurer l'API_URL et d'autres éventuelles variables.

Ce fichier :
  - est utilisé uniquement en local pour faciliter le développement.
  - n'est pas utilisé dans l'image finale déployée via Compose.
  - est volontairement exclu de l'image Docker afin de garantir une séparation claire entre le runtime de développement et celui de production. Mais aussi entre l'environnement pseudo-local et l'environnement de développement conteneurisé.

Lors du build de l'UI en production, la variable API_URL est injectée en tant qu'ARG, ce qui permet d'éviter toute dépendance au fichier .env.dev dans l'image.
⚠️ Précautions sur .env, .dockerignore et ARG dans Compose

Le fichier .env est volontairement ignoré dans .dockerignore pour éviter d’introduire un symlink cassé lors du build des images, ce qui pourrait provoquer des erreurs de build.

Les variables d'environnement sont passées explicitement :

    via --env-file dans les commandes Compose (ex: .env.dev, .env.test)

    via ARG pour le build de l'UI (API_URL notamment)

Bonnes pratiques :

    Éviter de stocker des secrets sensibles dans .env.dev ou .env.test.

    Pour la production, utiliser un mécanisme sécurisé de gestion des variables (ex: variables d’environnement dans le pipeline CI/CD).

Cette organisation garantit un comportement cohérent et "sécurisé" entre les différents environnements, tout en simplifiant l'expérience de développement.