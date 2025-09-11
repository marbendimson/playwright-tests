pipeline {
    agent any

    tools {
        nodejs 'node20'  // Use the NodeJS installation you configured
    }

    parameters {
        string(name: 'TEST_ENV', defaultValue: 'preprod', description: 'Environment to run tests')
        choice(name: 'BROWSER', choices: ['chromium','firefox','webkit'], description: 'Browser to run')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/marbendimson/playwright-tests.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'chmod +x ./node_modules/.bin/* || true'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh "export TEST_ENV=${params.TEST_ENV} && npx playwright test --browser=${params.BROWSER} --reporter=list,junit"
            }
        }

        stage('Archive Test Results') {
            steps {
                junit '**/test-results/results.xml'
                archiveArtifacts artifacts: '**/playwright-report/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always { cleanWs() }
    }
}
