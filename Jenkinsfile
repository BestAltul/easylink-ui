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

    stage('build ui') {
      agent {
        docker {
          image 'node:20-bullseye'
          // кеш npm, чтобы быстрее
          args '-u root:root -v $HOME/.npm:/root/.npm'
        }
      }
      steps {
        sh '''
          set -e
          if [ -f package.json ]; then cd .
          elif [ -f easylink-ui/package.json ]; then cd easylink-ui
          else echo "package.json not found"; exit 1; fi
          npm ci || npm i
          npm run build
        '''
        // забираем dist из текущей директории
        stash name: 'ui-dist', includes: 'dist/**'
      }
    }

    stage('put dist into backend static') {
      steps {
        dir("${BACK_DIR}") {
          sh 'rm -rf src/main/resources/static/* || true'
          unstash 'ui-dist'
          sh 'cp -r dist/* src/main/resources/static/'
          sh 'rm -rf dist || true'
        }
      }
    }

    stage('build backend') {
      agent {
        docker {
          image 'eclipse-temurin:21-jdk'
          args '-u root:root -v $HOME/.gradle:/root/.gradle'
        }
      }
      steps {
        dir("${env.BACK_DIR}") {
          sh '''
            set -e
            chmod +x gradlew || true
            ./gradlew clean build -x test
          '''
          archiveArtifacts artifacts: 'build/libs/*.jar', fingerprint: true
          stash name: 'app-jar', includes: 'build/libs/*.jar'
        }
      }
    }

    stage('export app.jar to /workspace/ymk/EasyLinkBackEnd') {
      steps {
        sh '''
          set -e
          mkdir -p "${DEPLOY_BE_DIR}"
        '''
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
        sh """
          set -e
          cd "${DEPLOY_DIR}"
          if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi
          # ВАЖНО: требуется docker CLI в агенте и примонтированный /var/run/docker.sock
          \$DC -f "${COMPOSE_FILE}" up -d --build postgres pgadmin zookeeper kafka auth-service
        """
      }
    }
  }

  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Build failed!' }
  }
}
