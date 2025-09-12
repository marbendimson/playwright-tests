pipeline {
    agent any

    tools {
        nodejs 'node20'
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
                sh '''
                  npm ci
                  npx playwright install
                '''
            }
        }

        stage('Validate Browser Selection') {
            steps {
                script {
                    if (params.BROWSER == 'webkit') {
                        error "❌ WebKit is disabled on this agent due to missing system dependencies. Please select chromium or firefox."
                    }
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh """
                  export TEST_ENV=${params.TEST_ENV}
                  npx playwright test tests/Catalogue/ \
                    --project=${params.BROWSER} \
                    --reporter=list,junit,html \
                    --output=results
                """
            }
        }

        stage('Archive Test Results') {
            steps {
                junit 'results/*.xml'
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            }
        }

        stage('Manual Trigger & Verify') {
            steps {
                input message: "✅ Confirm test run manually", ok: "I have verified pass/fail"
                echo """
                Manual Verification Instructions:
                1️⃣ Go to this Jenkins build page: ${env.BUILD_URL}
                2️⃣ Check 'Console Output' to see step-by-step test execution.
                3️⃣ Check JUnit results for pass/fail status.
                4️⃣ Open HTML report artifacts for detailed test results, screenshots, and traces.
                """
            }
        }
    }

    post {
        success {
            echo "Sending Slack SUCCESS notification..."
            slackSend(
                teamDomain: 'hostednetwork',
                channel: '#qa-alerts', 
                color: 'good', 
                message: "✅ Build ${env.JOB_NAME} #${env.BUILD_NUMBER} SUCCESS",
                tokenCredentialId: 'Slack-bot-Token'
            )
        }
        failure {
            echo "Sending Slack FAILURE notification..."
            slackSend(
                teamDomain: 'hostednetwork',
                channel: '#qa-alerts', 
                color: 'danger', 
                message: "❌ Build ${env.JOB_NAME} #${env.BUILD_NUMBER} FAILED",
                tokenCredentialId: 'Slack-bot-Token'
            )

            echo "Sending failure email..."
            mail(
                to: 'marben.dimson@hostednetwork.com.au',
                subject: "Jenkins Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Check Jenkins build logs: ${env.BUILD_URL}"
            )
        }
        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
    }
    

}
