pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    durabilityHint('PERFORMANCE_OPTIMIZED')
    skipDefaultCheckout(true)
  }

  tools { nodejs 'node20' }

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

    stage('build ui') {
      steps {
        sh '''
          set -e
          if [ -f package.json ]; then cd .
          elif [ -f easylink-ui/package.json ]; then cd easylink-ui
          else echo "package.json not found"; exit 1; fi
          npm ci || npm i
          npm run build
        '''
      }
    }

    stage('put dist into backend static') {
      steps {
        sh '''
          set -e
          STATIC_DIR="${BACK_DIR}/src/main/resources/static"
          SRC="dist"
          [ -d "easylink-ui/dist" ] && SRC="easylink-ui/dist"
          [ -d "$SRC" ] || { echo "dist not found"; exit 1; }
          rm -rf "$STATIC_DIR"
          mkdir -p "$STATIC_DIR"
          cp -r "$SRC/"* "$STATIC_DIR/"
        '''
      }
    }

    stage('build backend') {
      steps {
        dir("${env.BACK_DIR}") {
          sh '''
            set -e
            chmod +x gradlew
            ./gradlew clean build -x test
          '''
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
        '''
      }
    }

    stage('docker compose up (without jenkins)') {
      steps {
        sh '''
          set -e
          export DOCKER_HOST="${DOCKER_HOST:-tcp://host.docker.internal:2375}"
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
