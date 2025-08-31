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
  }

  stages {

    stage('preflight') {
      steps {
        sh '''
          set -eu
          echo "[preflight] whoami: $(whoami)"
          echo "[preflight] workspace: $PWD"

          echo "[preflight] docker:"
          docker version || true

          echo "[preflight] compose:"
          (docker compose version || docker-compose --version) || true
          DEP="${DEPLOY_DIR_LINUX:-}"
          if [ -z "$DEP" ]; then
            if   [ -d /run/desktop/mnt/host/c/ymk ]; then DEP="/run/desktop/mnt/host/c/ymk";
            elif [ -d /host_mnt/c/ymk ];           then DEP="/host_mnt/c/ymk";
            else DEP=""; fi
          fi
          echo "[preflight] DEPLOY_DIR (UI, Windows): ${DEPLOY_DIR:-<unset>}"
          echo "[preflight] DEPLOY_DIR_LINUX (UI):   ${DEPLOY_DIR_LINUX:-<unset>}"
          echo "[preflight] Resolved Linux path:     ${DEP:-<not-found>}"
          [ -n "$DEP" ] && ls -la "$DEP" || true
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

    stage('build ui (docker run)') {
      steps {
        sh '''
          bash -lc '
            set -euo pipefail

            echo "[ui] workspace: $PWD"
            ls -la

            UI_DIR=""
            if   [ -f package.json ];               then UI_DIR=".";
            elif [ -f easylink-ui/package.json ];   then UI_DIR="easylink-ui";
            elif [ -f ui/package.json ];            then UI_DIR="ui";
            else
              echo "[ui][error] package.json not found at ., easylink-ui, ui"
              exit 1
            fi

            echo "[ui] using UI_DIR=$UI_DIR"
            ls -la "$UI_DIR"

            docker run --rm \
              -v "$PWD/$UI_DIR":/app \
              -w /app \
              -v "$HOME/.npm":/root/.npm \
              node:20-bullseye bash -lc "npm ci || npm i && npm run build"

            rm -rf ui-dist && mkdir ui-dist
            cp -r "$UI_DIR/dist/." ui-dist/
            echo "[ui] dist prepared: $(ls -1 ui-dist | wc -l) files"
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
        sh """
          set -eu
          cp -r ui-dist/* "${env.BACK_DIR}/src/main/resources/static/"
          rm -rf ui-dist
          echo "[static] copied UI into ${env.BACK_DIR}/src/main/resources/static/"
        """
      }
    }

    stage('build backend (docker run)') {
      steps {
        sh """
          set -eu
          docker run --rm \
            -v "\$PWD/${env.BACK_DIR}":/app \
            -w /app \
            -v "\$HOME/.gradle":/home/gradle/.gradle \
            gradle:8.9-jdk21 bash -lc 'gradle clean bootJar -x test'

          ls ${env.BACK_DIR}/build/libs/*.jar
        """
        archiveArtifacts artifacts: "${env.BACK_DIR}/build/libs/*.jar", fingerprint: true
        stash name: 'app-jar', includes: "${env.BACK_DIR}/build/libs/*.jar"
      }
    }

    stage('export app.jar to Windows deploy dir') {
      steps {
        unstash 'app-jar'
        sh """
          set -eu

          # resolve linux path to C:\\ymk if not provided
          DEP="\${DEPLOY_DIR_LINUX:-}"
          if [ -z "\$DEP" ]; then
            if   [ -d /run/desktop/mnt/host/c/ymk ]; then DEP="/run/desktop/mnt/host/c/ymk";
            elif [ -d /host_mnt/c/ymk ];           then DEP="/host_mnt/c/ymk";
            else
              echo "[deploy][error] cannot resolve Linux path to C:\\\\ymk; set DEPLOY_DIR_LINUX in Jenkins UI"
              exit 1
            fi
          fi
          echo "[deploy] using DEPLOY_DIR_LINUX=\$DEP"

          mkdir -p "\$DEP/EasyLinkBackEnd"
          JAR=\$(ls ${env.BACK_DIR}/build/libs/*.jar | head -n 1)
          cp -f "\$JAR" "\$DEP/EasyLinkBackEnd/app.jar"
          ls -la "\$DEP/EasyLinkBackEnd"
        """
      }
    }

    stage('docker compose up') {
      steps {
        sh """
          set -eu

          DEP="\${DEPLOY_DIR_LINUX:-}"
          if [ -z "\$DEP" ]; then
            if   [ -d /run/desktop/mnt/host/c/ymk ]; then DEP="/run/desktop/mnt/host/c/ymk";
            elif [ -d /host_mnt/c/ymk ];           then DEP="/host_mnt/c/ymk";
            else
              echo "[compose][error] cannot resolve Linux path to C:\\\\ymk; set DEPLOY_DIR_LINUX in Jenkins UI"
              exit 1
            fi
          fi

          echo "[compose] cd \$DEP"
          cd "\$DEP"

          if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi

          BASE="docker-compose.yml"
          JNK1="docker-compose-jenkins.yml"
          JNK2="docker-compose.jenkins.yml"

          if   [ -f "\$BASE" ] && [ -f "\$JNK1" ]; then echo "[compose] \$BASE + \$JNK1"; \$DC -f "\$BASE" -f "\$JNK1" up -d --build;
          elif [ -f "\$BASE" ] && [ -f "\$JNK2" ]; then echo "[compose] \$BASE + \$JNK2"; \$DC -f "\$BASE" -f "\$JNK2" up -d --build;
          elif [ -f "\$JNK1" ]; then               echo "[compose] \$JNK1";             \$DC -f "\$JNK1" up -d --build;
          elif [ -f "\$JNK2" ]; then               echo "[compose] \$JNK2";             \$DC -f "\$JNK2" up -d --build;
          elif [ -f "\$BASE" ]; then               echo "[compose] \$BASE";             \$DC -f "\$BASE" up -d --build;
          else
            echo "[compose][error] no compose files in \$DEP"
            ls -la
            exit 1
          fi
        """
      }
    }
  }

  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Build failed!' }
  }
}
