pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    durabilityHint('PERFORMANCE_OPTIMIZED')
    skipDefaultCheckout(true)   
  }

  environment {

    BACK_REPO_URL = 'https://github.com/BestAltul/EasyLinkBackEnd.git'
    BACK_BRANCH   = 'main'
    BACK_DIR      = 'EasyLinkBackEnd'

    DEPLOY_DIR     = '/workspace/ymk'                
    DEPLOY_DIR_WIN = 'C:/ymk'                      
    COMPOSE_FILE   = "${env.DEPLOY_DIR}/docker-compose.yml"
    DEPLOY_BE_DIR  = "${env.DEPLOY_DIR}/EasyLinkBackEnd"
  }

  stages {

    stage('checkout frontend (this repo)') {
      steps {
        sh 'git config --global --add safe.directory "*"'

        checkout scm
        sh 'echo "Frontend checked out to: $PWD"; ls -la'
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
          export DOCKER_HOST="${DOCKER_HOST:-tcp://host.docker.internal:2375}"

          SHARED_DIR_LIN="${DEPLOY_DIR}/_ci/ymk-pipeline"     
          SHARED_DIR_WIN="${DEPLOY_DIR_WIN}/_ci/ymk-pipeline"  

          rm -rf "$SHARED_DIR_LIN" || true
          mkdir -p "$SHARED_DIR_LIN"

          cp -a "$WORKSPACE"/. "$SHARED_DIR_LIN"/

          docker run --rm \
            -v "$SHARED_DIR_WIN:/ws" \
            -w /ws \
            node:20-alpine sh -lc '
              set -e
              FRONT_DIR=/ws
              if [ ! -f /ws/package.json ] && [ -f /ws/easylink-ui/package.json ]; then
                FRONT_DIR=/ws/easylink-ui
              fi
              echo "Using FRONT_DIR=$FRONT_DIR"
              cd "$FRONT_DIR"
              if [ -f package-lock.json ]; then npm ci; else npm i; fi
              npm run build
            '
        '''
      }
    }

    stage('put dist into backend static') {
      steps {
        sh '''
          set -e
          SHARED_DIR_LIN="${DEPLOY_DIR}/_ci/ymk-pipeline"
          STATIC_DIR="${BACK_DIR}/src/main/resources/static"

          FRONT_DIST="$SHARED_DIR_LIN/dist"
          [ -d "$SHARED_DIR_LIN/easylink-ui/dist" ] && FRONT_DIST="$SHARED_DIR_LIN/easylink-ui/dist"

          [ -d "$FRONT_DIST" ] || { echo "ERROR: dist не найден в $FRONT_DIST"; exit 1; }

          rm -rf "$STATIC_DIR" || true
          mkdir -p "$STATIC_DIR"
          cp -r "$FRONT_DIST/"* "$STATIC_DIR/"
          echo "Copied $FRONT_DIST -> $STATIC_DIR"
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
          export DOCKER_HOST="${DOCKER_HOST:-tcp://host.docker.internal:2375}"
          cd "${DEPLOY_DIR}"

          if docker compose version >/dev/null 2>&1; then
            DC="docker compose"
          else
            DC="docker-compose"
          fi
          $DC -p app -f "${COMPOSE_FILE}" down --remove-orphans || true
          $DC -p app -f "${COMPOSE_FILE}" up -d --build postgres pgadmin zookeeper kafka auth-service
        '''
      }
    }
  }

  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Build failed!' }
  }
}
