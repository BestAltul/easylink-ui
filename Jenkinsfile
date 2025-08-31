pipeline {
  agent any

  options { timestamps(); disableConcurrentBuilds() }

  environment {
    BACK_REPO_URL = 'https://github.com/BestAltul/EasyLinkBackEnd.git'
    BACK_BRANCH   = 'main'
    BACK_DIR      = 'EasyLinkBackEnd'
    DEPLOY_FE     = "${DEPLOY_DIR}\\frontend\\dist"
    DEPLOY_BE_LIB = "${DEPLOY_DIR}\\backend\\app.jar"
    COMPOSE_FILE  = "${DEPLOY_DIR}\\docker-compose.yml"
  }

  stages {
    stage('checkout backend') {
      steps {
        dir("${env.BACK_DIR}") {
          git branch: "${env.BACK_BRANCH}", url: "${env.BACK_REPO_URL}"
        }
      }
    }

    stage('build ui') {
      steps {
        bat '''
          (npm ci) || (npm i)
          npm run build
        '''
      }
    }

    stage('copy FE dist') {
      steps {
        bat '''
          if exist "%DEPLOY_FE%" rmdir /S /Q "%DEPLOY_FE%"
          mkdir "%DEPLOY_FE%"
          robocopy "dist" "%DEPLOY_FE%" *.* /E /NFL /NDL /NJH /NJS /NP >NUL
        '''
      }
    }

    stage('build backend') {
      steps {
        dir("${env.BACK_DIR}") {
          bat 'gradlew.bat clean build -x test'
        }
      }
    }

    stage('copy BE jar') {
      steps {
        bat '''
          for %%f in ("%BACK_DIR%\\build\\libs\\*.jar") do (
            if not exist "%DEPLOY_DIR%\\backend" mkdir "%DEPLOY_DIR%\\backend"
            copy /Y "%%f" "%DEPLOY_BE_LIB%"
          )
        '''
      }
    }

    stage('docker compose up') {
      steps {
        bat '''
          cd /d "%DEPLOY_DIR%"
          docker compose -f "%COMPOSE_FILE%" up -d --build
        '''
      }
    }
  }

  post {
    success { echo 'Deployment successful!' }
    failure { echo 'Build failed!' }
  }
}
