pipeline {
    agent any

    tools {
        nodejs 'node20'  // Use your configured NodeJS installation
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
                // Clean install npm packages
                sh 'npm ci'

                // Install Playwright browser binaries only (no system dependencies)
                sh 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh """
                export TEST_ENV=${params.TEST_ENV}
                npx playwright test --browser=${params.BROWSER} --reporter=list,junit
                """
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
        always {
            cleanWs()
        }
    }
}
