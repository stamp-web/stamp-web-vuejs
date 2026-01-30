pipeline {
    agent any

    triggers {
        upstream(
            upstreamProjects: 'stamp-webservices',
            threshold: hudson.model.Result.SUCCESS
        )
        cron('H/15 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/stamp-web/stamp-web-vuejs.git',
                        credentialsId: 'jadrake-github'
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Update Browserslist DB') {
            steps {
                 sh 'npx update-browserslist-db@latest'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm run test:unit'
            }
            post {
                always {
                    junit 'test-results/**/*.xml'
                }
            }
        }

        stage('Build') {
            environment {
                NODE_ENV = 'production'
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Post Notify') {
            steps {
                sh '''
                    echo "{\"buildTime\": ${BUILD_ID}}" > dist/build-number.json
                    echo "${JOB_NAME} ${BUILD_ID}" > /tmp/build-stampweb-vuejs.trigger
                '''
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'dist/**', fingerprint: true
        }
        failure {
            echo 'Build failed'
        }
    }
}