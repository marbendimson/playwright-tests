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

        stage('Install Project Dependencies') {
            steps {
                // Install npm dependencies for this workspace
                sh 'npm ci'

                // Install Playwright browser binaries only (system deps already installed)
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
                // Save JUnit XML results
                junit '**/test-results/results.xml'

                // Archive the Playwright HTML report
                archiveArtifacts artifacts: '**/playwright-report/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            // Clean workspace after every run
            cleanWs()
        }
    }
}
