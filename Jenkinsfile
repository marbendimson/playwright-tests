pipeline {
    agent any

    tools {
        nodejs 'node20'  // Your NodeJS installation
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
                sh 'npm ci'
                sh 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh """
                  export TEST_ENV=${params.TEST_ENV}
                  npx playwright test tests/Catalogue/TC_001_Verify_Virtual_Machine_Templatepage.spec.ts --project=${params.BROWSER} --reporter=list,junit,html
                """
            }
        }

        stage('Archive Test Results') {
            steps {
                // Archive JUnit XML results
                junit '**/test-results/results.xml'
                
                // Archive HTML report
                archiveArtifacts artifacts: '**/playwright-report/**', allowEmptyArchive: true
            }
        }
    }

    post {
        success {
            echo "Sending Slack SUCCESS notification..."
            slackSend(
                channel: '#qa-alerts', 
                color: 'good', 
                message: "✅ Build ${env.JOB_NAME} #${env.BUILD_NUMBER} SUCCESS",
                tokenCredentialId: 'slack-bot-token' // Secret Text credential containing your Bot Token
            )
        }
        failure {
            echo "Sending Slack FAILURE notification..."
            slackSend(
                channel: '#qa-alerts', 
                color: 'danger', 
                message: "❌ Build ${env.JOB_NAME} #${env.BUILD_NUMBER} FAILED",
                tokenCredentialId: 'slack-bot-token'
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
