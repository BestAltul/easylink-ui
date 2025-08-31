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

    DEPLOY_DIR    = '/workspace/ymk'
    COMPOSE_FILE  = "${env.DEPLOY_DIR}/docker-compose.yml"
    DEPLOY_BE_DIR = "${env.DEPLOY_DIR}/EasyLinkBackEnd"
  }

  stages {
    stage('prepare git & checkout frontend') {
      steps {
        sh '''
          set -e
          git config --global --add safe.directory '*'
          if [ ! -d .git ]; then
            git init
            git remote add origin https://github.com/BestAltul/easylink-ui
          fi
          git fetch --depth=1 origin main
          git checkout -f FETCH_HEAD
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
          export DOCKER_HOST="${DOCKER_HOST:-tcp://host.docker.internal:2375}"
    
          # Общая папка с хостом (C:\\ymk)
          SHARED_DIR="/workspace/ymk/_ci/ymk-pipeline"
          rm -rf "$SHARED_DIR" || true
          mkdir -p "$SHARED_DIR"
    
          # Кладём туда текущий workspace
          # (исключим .git, node_modules на всякий случай)
          rsync -a --delete --exclude ".git" --exclude "node_modules" ./ "$SHARED_DIR"/ || cp -a . "$SHARED_DIR"/
    
          # Собираем фронт ВНУТРИ node-контейнера, монтируя SHARED_DIR
          docker run --rm \
            -v "$SHARED_DIR":/ws \
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
          SHARED_DIR="/workspace/ymk/_ci/ymk-pipeline"
          STATIC_DIR="${BACK_DIR}/src/main/resources/static"
      
          FRONT_DIST="$SHARED_DIR/dist"
          if [ -d "$SHARED_DIR/easylink-ui/dist" ]; then
            FRONT_DIST="$SHARED_DIR/easylink-ui/dist"
          fi
      
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
