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
    // ожидается, что DOCKER_HOST уже задан в UI: tcp://host.docker.internal:2375
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

    stage('build ui (no mounts)') {
      steps {
        sh '''
          bash -lc '
            set -euo pipefail

            UI_DIR=""
            if   [ -f package.json ];             then UI_DIR=".";
            elif [ -f easylink-ui/package.json ]; then UI_DIR="easylink-ui";
            elif [ -f ui/package.json ];          then UI_DIR="ui";
            else echo "[ui][error] package.json not found"; exit 1; fi
            echo "[ui] using UI_DIR=$UI_DIR"

            rm -rf ui-dist ui-dist.tar

            # передаём исходники в контейнер через stdin, возвращаем dist.tar через stdout
            tar -C "$UI_DIR" -cf - . \
            | docker run --rm -i node:20-bullseye bash -lc "
                set -e
                mkdir -p /app
                tar -C /app -xf -
                cd /app
                npm ci || npm i
                npm run build
                tar -C /app/dist -cf - .
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

          # скармливаем код бэка в gradle-контейнер, вытаскиваем банку обратно
          tar -C "${BACK_DIR}" -cf - . \
          | docker run --rm -i gradle:8.9-jdk21 bash -lc '
              set -e
              mkdir -p /app
              tar -C /app -xf -
              cd /app
              gradle clean bootJar -x test
              JAR=$(ls build/libs/*.jar | head -n1)
              echo "[gradle] built: ${JAR}"
              tar -C "$(dirname "$JAR")" -cf - "$(basename "$JAR")"
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
        sh '''
          set -eu
          unstash app-jar

          cat > Dockerfile.ci <<'EOF'
          FROM eclipse-temurin:21-jre
          WORKDIR /app
          COPY app.jar /app/app.jar
          EXPOSE 8080
          ENTRYPOINT ["java","-jar","/app/app.jar"]
          EOF

          # docker-cli заархивирует контекст и отправит его в daemon по DOCKER_HOST
          docker build -t "${IMAGE_TAG}" -f Dockerfile.ci .
          docker images | grep -E "ymk/auth-service|REPOSITORY"
        '''
      }
    }

    stage('compose up') {
      steps {
        sh '''
          set -eu
          # если задан внешний compose — используем его; иначе — пишем fallback yaml
          if [ -n "${COMPOSE_FILE_LINUX:-}" ] && [ -f "${COMPOSE_FILE_LINUX}" ]; then
            echo "[compose] using external file: ${COMPOSE_FILE_LINUX}"
            FILE_OPT="-f ${COMPOSE_FILE_LINUX}"
            WORKDIR="$(dirname "${COMPOSE_FILE_LINUX}")"
          else
            echo "[compose] using fallback ci-compose.yml (named volumes, no bind mounts)"
            WORKDIR="$PWD"
            cat > ci-compose.yml <<'YAML'
            services:
              postgres:
                image: postgres:16
                environment:
                  POSTGRES_DB: easylink
                  POSTGRES_USER: postgres
                  POSTGRES_PASSWORD: postgres
                ports: ["5432:5432"]
                volumes: ["pgdata:/var/lib/postgresql/data"]
                restart: unless-stopped

              zookeeper:
                image: confluentinc/cp-zookeeper:7.5.0
                environment:
                  ZOOKEEPER_CLIENT_PORT: 2181
                restart: unless-stopped

              kafka:
                image: confluentinc/cp-kafka:7.5.0
                environment:
                  KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
                  KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
                  KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
                depends_on: [zookeeper]
                ports: ["9092:9092"]
                restart: unless-stopped

              pgadmin:
                image: dpage/pgadmin4
                environment:
                  PGADMIN_DEFAULT_EMAIL: admin@example.local
                  PGADMIN_DEFAULT_PASSWORD: adminpass
                ports: ["5050:80"]
                depends_on: [postgres]
                restart: unless-stopped

              auth-service:
                image: ymk/auth-service:latest
                depends_on: [postgres, kafka]
                environment:
                  SPRING_PROFILES_ACTIVE: prod
                  # добавь свои переменные, если нужны (URL БД/Kafka и т.п.)
                ports: ["8080:8080"]
                restart: unless-stopped

            volumes:
              pgdata:
            YAML
            FILE_OPT="-f ci-compose.yml"
          fi

          cd "$WORKDIR"
          if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi
          $DC $FILE_OPT up -d
          $DC $FILE_OPT ps
        '''
      }
    }
  }

  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Build failed!' }
  }
}
