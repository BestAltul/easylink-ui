pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    durabilityHint('PERFORMANCE_OPTIMIZED')
    skipDefaultCheckout(true)
  }

  environment {
    DOCKER_HOST = 'tcp://host.docker.internal:2375'
    BACK_REPO_URL = 'https://github.com/approachh/EasyLinkBackEnd.git'
    BACK_BRANCH   = 'main'
    BACK_DIR      = 'EasyLinkBackEnd'
    IMAGE_TAG     = 'ymk/auth-service:latest'
    AMPLITUDE_API_KEY = credentials('amplitude-api-key')
  }

  stages {
    stage('preflight') {
      steps {
        sh '''
          set -eu
          echo "[preflight] whoami: $(whoami)"
          echo "[preflight] workspace: $PWD"
          echo "[preflight] DOCKER_HOST=${DOCKER_HOST:-<unset>}"
          docker -H "$DOCKER_HOST" version || (echo "[error] docker unreachable" && exit 1)
          (docker compose version || docker-compose --version) || true
        '''
      }
    }

    stage('diagnose docker tcp') {
      steps {
        sh '''
          set -e
          echo "[diag] DOCKER_HOST=$DOCKER_HOST"
          docker -H "$DOCKER_HOST" info --format "server={{.ServerVersion}}  os={{.OperatingSystem}}"
          docker -H "$DOCKER_HOST" ps --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}" || true
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
          UI_DIR="."
          [ -f package.json ] || { echo "[ui][error] package.json not found in ."; exit 1; }
  
          rm -rf ui-dist ui-dist.tar
          # ВАЖНО: прокидываем VITE_AMPLITUDE_API_KEY в контейнер
          tar -C "$UI_DIR" -cf - . | docker -H "$DOCKER_HOST" run --rm -i \
            -e VITE_AMPLITUDE_API_KEY="${AMPLITUDE_API_KEY}" \
            node:20-bullseye bash -lc "
              set -e
              mkdir -p /app
              tar -C /app -xf -
              cd /app
              echo [ui] VITE_AMPLITUDE_API_KEY=\${VITE_AMPLITUDE_API_KEY:+***set***}
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
          | docker -H "$DOCKER_HOST" run --rm -i gradle:8.9-jdk21 bash -lc '
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
          set -e
          BACK_SHA=$(git -C EasyLinkBackEnd rev-parse --short=12 HEAD || echo unknown)
          BUILD_TIME=$(date -u +%FT%TZ)

          cat > Dockerfile.ci <<'EOF'
ARG BUILD_SHA=unknown
ARG BUILD_TIME=unknown
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY app.jar /app/app.jar
ENV APP_BUILD_SHA=${BUILD_SHA} \
    APP_BUILD_TIME=${BUILD_TIME}
LABEL org.opencontainers.image.revision=${BUILD_SHA} \
      org.opencontainers.image.created=${BUILD_TIME} \
      org.opencontainers.image.title="ymk/auth-service"
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
EOF

          docker -H "$DOCKER_HOST" image rm "${IMAGE_TAG}" -f || true
          docker -H "$DOCKER_HOST" build --no-cache \
            -t "${IMAGE_TAG}" \
            --build-arg BUILD_SHA="$BACK_SHA" \
            --build-arg BUILD_TIME="$BUILD_TIME" \
            -f Dockerfile.ci .
          docker -H "$DOCKER_HOST" image inspect "${IMAGE_TAG}" \
            --format "id={{.Id}}  created={{.Created}}  tags={{.RepoTags}}"
        '''
      }
    }

    stage('compose up') {
      steps {
        sh '''
          set -e
          if docker compose version >/dev/null 2>&1; then
            DC="docker compose"
          elif command -v docker-compose >/dev/null 2>&1; then
            DC="docker-compose"
          else
            echo "[error] docker compose not found"; exit 1
          fi

          FILE_MAIN="/workspace/ymk/docker-compose.yml"
          FILE_JENKINS="/workspace/ymk/docker-compose-jenkins.yml"

          echo "[compose] using: $FILE_MAIN + $FILE_JENKINS"
          ls -la /workspace/ymk || true
          docker -H "$DOCKER_HOST" image inspect "${IMAGE_TAG}" >/dev/null
          DOCKER_HOST="$DOCKER_HOST" $DC -f "$FILE_MAIN" -f "$FILE_JENKINS" up -d --force-recreate auth-service

          CID=$(DOCKER_HOST="$DOCKER_HOST" $DC -f "$FILE_MAIN" -f "$FILE_JENKINS" ps -q auth-service)
          IMG=$(docker -H "$DOCKER_HOST" inspect "$CID" --format '{{.Image}}')
          echo "[compose] auth-service image=$IMG"
          docker -H "$DOCKER_HOST" image inspect "$IMG" --format 'created={{.Created}} tags={{.RepoTags}}'
        '''
      }
    }
  }

  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Build failed!' }
  }
}
