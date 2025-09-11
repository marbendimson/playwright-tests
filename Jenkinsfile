pipeline {
    agent any

    parameters {
        string(name: 'TEST_ENV', defaultValue: 'preprod', description: 'Environment to run the tests (dev, preprod, staging, prod)')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Browser to run Playwright tests')
    }

    environment {
        NODE_VERSION = '18'  // Adjust if needed
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from GitHub..."
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
                echo "Running Playwright tests in ${params.TEST_ENV} on ${params.BROWSER}..."
                // Pass the environment and browser as environment variables to your test
                sh """
                    export TEST_ENV=${params.TEST_ENV}
                    npx playwright test --browser=${params.BROWSER} --reporter=list,junit
                """
            }
        }

        stage('Archive Test Results') {
            steps {
                echo 'Archiving Playwright reports...'
                junit '**/test-results/results.xml'  // Adjust if your JUnit output path is different
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
