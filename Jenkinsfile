pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    durabilityHint('PERFORMANCE_OPTIMIZED')
    skipDefaultCheckout(true)
  }

  environment {
    BACK_REPO_URL = 'https://github.com/approachh/EasyLinkBackEnd.git'
    BACK_BRANCH   = 'main'
    BACK_DIR      = 'EasyLinkBackEnd'
    DEPLOY_DIR    = '/workspace/ymk'
    COMPOSE_FILE  = "${env.DEPLOY_DIR}/docker-compose.yml"
    DEPLOY_BE_DIR = "${env.DEPLOY_DIR}/EasyLinkBackEnd"
  }

  stages {
    stage('checkout frontend (this repo)') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/BestAltul/easylink-ui']]
        ])
      }
    }

    stage('checkout backend') {
      steps {
        sh "rm -rf '${BACK_DIR}'"
        dir("${BACK_DIR}") {
          git branch: "${env.BACK_BRANCH}", url: "${env.BACK_REPO_URL}"
        }
      }
    }

    stage('build ui (docker run)') {
      steps {
        sh '''
          set -e
    
          echo "[debug] workspace: $PWD"
          echo "[debug] tree (top level):"
          ls -la
    
          UI_DIR=""
          if [ -f package.json ]; then
            UI_DIR="."
          elif [ -f easylink-ui/package.json ]; then
            UI_DIR="easylink-ui"
          elif [ -f ui/package.json ]; then
            UI_DIR="ui"
          else
            echo "[error] package.json not found at '.', 'easylink-ui', or 'ui'"
            echo "[hint] run: find . -maxdepth 2 -name package.json"
            exit 1
          fi
    
          echo "[debug] using UI_DIR=$UI_DIR"
          echo "[debug] show UI_DIR contents:"
          ls -la "$UI_DIR"
    
          docker run --rm \
            -v "$PWD/$UI_DIR":/app \
            -w /app \
            -v "$HOME/.npm":/root/.npm \
            node:20-bullseye bash -lc "npm ci || npm i && npm run build"
    
          rm -rf ui-dist && mkdir ui-dist
          cp -r "$UI_DIR/dist/." ui-dist/
        '''
        stash name: 'ui-dist', includes: 'ui-dist/**'
      }
    }


    stage('put dist into backend static') {
      steps {
        unstash 'ui-dist'
        dir("${BACK_DIR}") {
          sh '''
            set -e
            rm -rf src/main/resources/static/* || true
            mkdir -p src/main/resources/static
          '''
        }
        sh 'cp -r ui-dist/* "${BACK_DIR}/src/main/resources/static/" && rm -rf ui-dist'
      }
    }
    
    stage('build backend (docker run)') {
      steps {
        sh '''
          set -e
          # собрать jar с gradle-cli внутри контейнера
          docker run --rm \
            -v "$PWD/${BACK_DIR}":/app \
            -w /app \
            -v "$HOME/.gradle":/home/gradle/.gradle \
            gradle:8.9-jdk21 bash -lc "gradle clean bootJar -x test"

          # архивируем и stash'им банку
          ls ${BACK_DIR}/build/libs/*.jar
        '''
        archiveArtifacts artifacts: "${BACK_DIR}/build/libs/*.jar", fingerprint: true
        stash name: 'app-jar', includes: "${BACK_DIR}/build/libs/*.jar"
      }
    }

    stage('export app.jar to /workspace/ymk/EasyLinkBackEnd') {
      steps {
        sh 'mkdir -p "${DEPLOY_BE_DIR}"'
        unstash 'app-jar'
        sh '''
          set -e
          JAR=$(ls ${BACK_DIR}/build/libs/*.jar | head -n 1)
          cp -f "$JAR" "${DEPLOY_BE_DIR}/app.jar"
        '''
      }
    }

    stage('docker compose up (without jenkins)') {
      when { expression { return fileExists(env.COMPOSE_FILE) } }
      steps {
        sh '''
          set -e
          cd "${DEPLOY_DIR}"
          if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi
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
