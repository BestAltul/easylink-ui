pipeline {
  agent any

  options {
    timestamps()
    durabilityHint('PERFORMANCE_OPTIMIZED')
    disableConcurrentBuilds()
  }

  environment {
    BACK_REPO_URL = 'https://github.com/BestAltul/EasyLinkBackEnd.git'
    BACK_BRANCH   = 'main'
    BACK_DIR      = 'EasyLinkBackEnd'
    BACK_STATIC   = "${env.BACK_DIR}/src/main/resources/static"
    COMPOSE_FILE  = "${env.BACK_DIR}/docker-compose.yml"
    GIT_CREDS     = 'github-pat-or-ssh-creds'
  }

  stages {
    stage('frontend checked out') {
      steps {
        echo "workspace = ${pwd()}"
        sh 'ls -la'
      }
    }

    stage('checkout backend') {
      steps {
        dir("${env.BACK_DIR}") {
          git branch: "${env.BACK_BRANCH}",
              credentialsId: "${env.GIT_CREDS}",
              url: "${env.BACK_REPO_URL}"
        }
      }
    }

    stage('verify node') {
      steps {
        sh '''
          set -e
          which node || true
          node -v
          npm -v
        '''
      }
    }

    stage('build ui') {
      steps {
        sh '''
          set -e
          corepack enable || true
          (npm ci || npm i)
          npm run build
        '''
      }
    }

    stage('move dist to backend static') {
      steps {
        sh '''
          set -e
          rm -rf "${BACK_STATIC}" || true
          mkdir -p "${BACK_STATIC}"
          cp -r dist/* "${BACK_STATIC}/"
          echo "Copied dist -> ${BACK_STATIC}"
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

    stage('build & deploy docker') {
      steps {
        sh '''
          set -e
          docker compose -f "${COMPOSE_FILE}" build
          docker compose -f "${COMPOSE_FILE}" up -d
        '''
      }
    }
  }

  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Build failed!' }
  }
}
