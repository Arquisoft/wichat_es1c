# 📱 wichat_es1c
<div align="center">

 [![Actions Status](https://github.com/arquisoft/wichat_es1c/workflows/CI%20for%20wichat_es1c/badge.svg)](https://github.com/arquisoft/wichat_es1c/actions)
 [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es1c&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es1c)
 [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es1c&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es1c)
 [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es1c&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es1c)
 [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es1c&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es1c)
 [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es1c&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es1c)
 [![CodeScene general](https://codescene.io/images/analyzed-by-codescene-badge.svg)](https://codescene.io/projects/65367)
[![CodeScene Average Code Health](https://codescene.io/projects/65367/status-badges/average-code-health)](https://codescene.io/projects/65367)
[![CodeScene Hotspot Code Health](https://codescene.io/projects/65367/status-badges/hotspot-code-health)](https://codescene.io/projects/65367)

  ---

  ## 👨‍💻 Developers

  | 🧑‍💼 Name                          | GitHub Username                              |
  |------------------------------------|----------------------------------------------|
  | Daniel Alberto Alonso Fernández   | <a href="https://github.com/DalonfeUO"><img src="https://img.shields.io/badge/Daniel Alberto Alonso Fernández-green"></a>   |
  | David Álvarez Cabezas             | <a href="https://github.com/davidalvarezcabezas"><img src="https://img.shields.io/badge/David Álvarez Cabezas-purple"></a> |
  | Alejandro Fernández García        | <a href="https://github.com/alejandrofdzgarcia"><img src="https://img.shields.io/badge/Alejandro Fernández García-blue"></a> |
  | Mario García Prieto               | <a href="https://github.com/mario5garciap"><img src="https://img.shields.io/badge/Mario García Prieto-red"></a> |

  [![Logo](/webapp/public/LogoWichat.png)](http://20.86.137.211:3000/)

</div>


## 📖 About the Project

This is a base project for the **Software Architecture course (2024/2025)**. It is a basic application composed of several components:

- **User Service**: Handles the insertion of new users in the system.
- **LLM Service**: Communicates with the LLM (Language Learning Model).
- **Gateway Service**: Acts as a public-facing proxy for the above services.
- **Webapp**: A React-based web application for login and user management.

## ✨ Key Features

1. **User Registration and Login**: Allows users to securely register and authenticate.
2. **ChatBot**: Provides users with hints for game questions.
3. **Profile Management**: Users can update their personal information.
4. **Rankings**: Includes a global ranking of all users' games and a personal ranking where users can access their answers and the correct ones for each game.
5. **User Management**: Administrators have access to a menu to view all registered users and delete any user if needed.

---

## 🚀 Quick Start Guide

### 1️⃣ Clone the Project
```bash
git clone git@github.com:arquisoft/wichat_es1c.git
```

### 2️⃣ LLM API Key Configuration

To enable LLM communication, configure an API key for either **Gemini** or **Empathy**. Follow these steps:

1. Create a `.env` file in the **webapp** directory:
   ```env
   REACT_APP_LLM_API_KEY="YOUR-API-KEY"
   ```

2. Create another `.env` file in the **root directory** (next to `docker-compose.yml`):
   ```env
   LLM_API_KEY="YOUR-API-KEY"
   ```

> **Note**: These files are excluded from version control via `.gitignore`. For deployment, add the API key as a **repository secret** (`LLM_API_KEY`).

---

### 3️⃣ Launching with Docker

To start the application using Docker Compose:
```bash
docker compose --profile dev up --build
```

### 4️⃣ Component-by-Component Start

1. Start the database:
   ```bash
   docker run -d -p 27017:27017 --name=my-mongo mongo:latest
   ```
   Alternatively, use a cloud service like **MongoDB Atlas**.

2. Start the services:
   - Navigate to each service directory (`auth`, `user`, `gateway`) and run:
     ```bash
     npm install
     npm start
     ```

3. Start the webapp:
   - Navigate to the `webapp` directory and run:
     ```bash
     npm install
     npm start
     ```

The app will be available at `http://localhost:3000`.

---

## 🌐 Deployment

### Machine Requirements
- **OS**: Linux (Ubuntu 20.04 or higher, recommended 24.04).
- **Docker**: Installed.
- **Ports**: Open ports (3000 for the webapp, 8000 for the gateway).

### Install Docker on the Machine
```bash
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
sudo apt install docker-ce
sudo usermod -aG docker ${USER}
```

---

### Continuous Delivery with GitHub Actions

Deployment is automated using **GitHub Actions**. The process is triggered when a new release is created. The workflow includes:

1. Running unit and e2e tests.
2. Pushing Docker images to GitHub Packages.
3. Deploying the application via SSH.

#### Deployment Workflow
```yaml
deploy:
  name: Deploy over SSH
  runs-on: ubuntu-latest
  needs: [docker-push-userservice, docker-push-authservice, docker-push-llmservice, docker-push-gatewayservice, docker-push-webapp]
  steps:
    - name: Deploy over SSH
      uses: fifsky/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        user: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        command: |
          wget https://raw.githubusercontent.com/arquisoft/wichat_es1c/master/docker-compose.yml -O docker-compose.yml
          docker compose --profile prod down
          docker compose --profile prod up -d --pull always
```

#### Required Secrets
- **DEPLOY_HOST**: IP address of the remote machine.
- **DEPLOY_USER**: User with SSH access.
- **DEPLOY_KEY**: SSH private key for authentication.

---

## 🛠️ Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Code Coverage**: SonarCloud
- **Load Testing**: Gatling
- **Deployment**: Azure