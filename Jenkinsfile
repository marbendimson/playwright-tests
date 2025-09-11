pipeline {
    agent any

    environment {
        NODE_VERSION = '18'  // Adjust if needed
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                git branch: 'master', url: 'https://github.com/marbendimson/playwright-tests.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
                echo 'Installing Playwright browsers...'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo 'Running Playwright test suite...'
                sh 'npx playwright test --reporter=list,junit'
            }
        }

        stage('Archive Test Results') {
            steps {
                echo 'Archiving Playwright reports...'
                junit '**/test-results/results.xml'  // Adjust path if needed
                archiveArtifacts artifacts: '**/playwright-report/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Playwright tests completed successfully!'
        }
        failure {
            echo 'Playwright tests failed.'
        }
    }
}
