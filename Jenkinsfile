pipeline {
  agent any
  options {
    timestamps()
    disableConcurrentBuilds()
    durabilityHint('PERFORMANCE_OPTIMIZED')
  }

  environment {
    BACK_REPO_URL = 'https://github.com/BestAltul/EasyLinkBackEnd.git'
    BACK_BRANCH   = 'main'
    BACK_DIR      = 'EasyLinkBackEnd' 

    DEPLOY_DIR   = '/workspace/ymk'
    COMPOSE_FILE = "${env.DEPLOY_DIR}/docker-compose.yml"
  
    DEPLOY_BE_DIR = "${env.DEPLOY_DIR}/EasyLinkBackEnd"
  }

  stages {
    stage('env check') {
      steps {
        sh '''
          set -e
          echo "workspace: $(pwd)"
          node -v && npm -v || true
          docker version || true
          ls -la
        '''
      }
    }

    stage('checkout backend') {
      steps {
        dir("${env.BACK_DIR}") {
          git branch: "${env.BACK_BRANCH}", url: "${env.BACK_REPO_URL}"
        }
      }
    }

    stage('build ui') {
      steps {
        sh '''
          set -e
          docker run --rm \
            -v "$PWD":/app \
            -w /app \
            node:20-alpine sh -lc "corepack enable || true; (npm ci || npm i); npm run build"
        '''
      }
    }

    stage('put dist into backend static') {
      steps {
        sh '''
          set -e
          STATIC_DIR="${BACK_DIR}/src/main/resources/static"
          rm -rf "$STATIC_DIR" || true
          mkdir -p "$STATIC_DIR"
          cp -r dist/* "$STATIC_DIR/"
          echo "Copied dist -> $STATIC_DIR"
        '''
      }
    }

    stage('build backend') {
      steps {
        dir("${env.BACK_DIR}") {
          sh './gradlew clean build -x test'
        }
      }
    }

    stage('export app.jar to /workspace/ymk/EasyLinkBackEnd') {
      steps {
        sh '''
          set -e
          mkdir -p "${DEPLOY_BE_DIR}"
          JAR=$(ls ${BACK_DIR}/build/libs/*.jar | head -n 1)
          cp -f "$JAR" "${DEPLOY_BE_DIR}/app.jar"
          echo "Copied $(basename "$JAR") -> ${DEPLOY_BE_DIR}/app.jar"
        '''
      }
    }

    stage('docker compose up (without jenkins)') {
      steps {
        sh '''
          set -e
          cd "${DEPLOY_DIR}"
          if docker compose version >/dev/null 2>&1; then
            DC="docker compose"
          else
            DC="docker-compose"
          fi

          $DC -f "${COMPOSE_FILE}" up -d --build postgres pgadmin zookeeper kafka auth-service
        '''
      }
    }
  }

  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Build failed!' }
  }
}
