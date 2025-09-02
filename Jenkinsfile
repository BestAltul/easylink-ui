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
    IMAGE_TAG     = 'ymk/auth-service:latest'
  }

  stages {
    stage('preflight') {
      steps {
        sh '''
          set -eu
          echo "[preflight] whoami: $(whoami)"
          echo "[preflight] workspace: $PWD"
          echo "[preflight] DOCKER_HOST=${DOCKER_HOST:-<unset>}"
          docker version || (echo "[error] docker unreachable" && exit 1)
          (docker compose version || docker-compose --version) || true
        '''
      }
    }

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
        sh "rm -rf '${env.BACK_DIR}'"
        dir("${env.BACK_DIR}") {
          git branch: "${env.BACK_BRANCH}", url: "${env.BACK_REPO_URL}"
        }
      }
    }

    stage('build ui') {
      steps {
        sh '''
          bash -lc '
            set -euo pipefail
            UI_DIR=""
            if   [ -f package.json ]; then UI_DIR=".";
            elif [ -f easylink-ui/package.json ]; then UI_DIR="easylink-ui";
            elif [ -f ui/package.json ]; then UI_DIR="ui";
            else echo "[ui][error] package.json not found"; exit 1; fi
            rm -rf ui-dist ui-dist.tar
            tar -C "$UI_DIR" -cf - . | docker run --rm -i node:20-bullseye bash -lc "
              set -e
              mkdir -p /app
              tar -C /app -xf -
              cd /app
              npm ci 1>&2 || npm i 1>&2
              npm run build 1>&2
              exec tar -C /app/dist -cf - .
            " > ui-dist.tar
            mkdir -p ui-dist
            tar -C ui-dist -xf ui-dist.tar
            rm -f ui-dist.tar
            echo "[ui] dist files: $(ls -1 ui-dist | wc -l)"
          '
        '''
        stash name: 'ui-dist', includes: 'ui-dist/**'
      }
    }

    stage('put dist into backend static') {
      steps {
        unstash 'ui-dist'
        dir("${env.BACK_DIR}") {
          sh '''
            set -eu
            mkdir -p src/main/resources/static
            rm -rf src/main/resources/static/* || true
          '''
        }
        sh '''
          set -eu
          cp -r ui-dist/* "${BACK_DIR}/src/main/resources/static/"
          rm -rf ui-dist
          echo "[static] UI copied into backend resources/static"
        '''
      }
    }

    stage('build backend jar (no mounts)') {
      steps {
        sh '''
          set -eu
          rm -f app.jar app-jar.tar
          tar -C "${BACK_DIR}" -cf - . \
          | docker run --rm -i gradle:8.9-jdk21 bash -lc '
              set -e
              mkdir -p /app
              tar -C /app -xf -
              cd /app
              gradle clean bootJar -x test 1>&2
              JAR=$(ls build/libs/*.jar | head -n1)
              >&2 echo "[gradle] built: ${JAR}"
              exec tar -C "$(dirname "$JAR")" -cf - "$(basename "$JAR")"
            ' > app-jar.tar
          mkdir -p out-jar
          tar -C out-jar -xf app-jar.tar
          JAR_PATH=$(ls out-jar/*.jar | head -n1)
          mv "$JAR_PATH" app.jar
          rm -rf out-jar app-jar.tar
          ls -la app.jar
        '''
        archiveArtifacts artifacts: "app.jar", fingerprint: true
        stash name: 'app-jar', includes: "app.jar"
      }
    }

    stage('build runtime image') {
      steps {
        unstash 'app-jar'
        sh '''
          set -eu
          cat > Dockerfile.ci <<'EOF'
          FROM eclipse-temurin:21-jre
          WORKDIR /app
          COPY app.jar /app/app.jar
          EXPOSE 8080
          ENTRYPOINT ["java","-jar","/app/app.jar"]
          EOF
          docker build -t "${IMAGE_TAG}" -f Dockerfile.ci .
          docker images | grep -E "ymk/auth-service|REPOSITORY" || true
        '''
      }
    }

    stage('compose up') {
      steps {
        sh '''
          set -eu
    
          [ -f docker-compose.yml ] || { echo "[compose] docker-compose.yml not found"; exit 1; }
          [ -f docker-compose-jenkins.yml ] || { echo "[compose] docker-compose-jenkins.yml not found"; exit 1; }
    
          docker image inspect "${IMAGE_TAG}" >/dev/null 2>&1 || {
            echo "[compose] local image missing — building ${IMAGE_TAG}"
            [ -f Dockerfile.ci ] || { echo "[compose][error] Dockerfile.ci not found"; exit 1; }
            docker build -t "${IMAGE_TAG}" -f Dockerfile.ci .
          }
    
          if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi
          $DC -f docker-compose.yml -f docker-compose-jenkins.yml up -d --build
          $DC -f docker-compose.yml -f docker-compose-jenkins.yml ps
        '''
      }
    }
}

  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Build failed!' }
  }
}
