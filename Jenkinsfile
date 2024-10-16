pipeline {
    agent {
        label 'Node-Loyaltri'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir() // Clean the workspace
            }
        }
        stage('CD - Checkout Code') {
            steps {
                git branch: 'developement-loyaltri', credentialsId: '1a925f29-a4bb-49e5-aac8-4588317ad816', url: 'https://haseeb-docme@bitbucket.org/docmephpdeveloper/loyaltri-ui.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install --force' // Install dependencies
            }
        }
        stage('Build') {
            steps {
                script {
                    // Unset CI variable before running the build
                    sh 'unset CI && npm run build:dev'
                }
            }
        }
        stage('Deploy') {
            environment {
                REMOTE_USER = 'ubuntu'
                REMOTE_HOST = '65.0.190.73'
                REMOTE_PATH = '/var/www/html'
                TEMP_PATH = '/home/ubuntu'
            }
            steps {
                script {
                    // Tar the build folder
                    sh 'tar -zcvf build.tar.gz -C build .'
                    
                    // Use SSH agent with Jenkins credentials
                    withCredentials([sshUserPrivateKey(credentialsId: '9339375a-d1d6-42e6-94f0-482b07d7080b', keyFileVariable: 'SSH_KEY')]) {
                        // Securely copy the tar file to a temporary location on the remote server using scp
                        sh "scp -o StrictHostKeyChecking=no -i ${SSH_KEY} build.tar.gz ${REMOTE_USER}@${REMOTE_HOST}:${TEMP_PATH}"
                        
                        // Connect to the remote server, move the tar file to the desired directory, extract it, and remove the tar file
                        sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${REMOTE_USER}@${REMOTE_HOST} << 'EOF'
                            sudo rm -rf ${REMOTE_PATH}/*
                            sudo mv ${TEMP_PATH}/build.tar.gz ${REMOTE_PATH}
                            cd ${REMOTE_PATH}
                            sudo tar -xvzf build.tar.gz -C ${REMOTE_PATH}
                            sudo rm build.tar.gz
                            sudo systemctl restart nginx
EOF
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            // Clean up workspace after build
            cleanWs()
        }
        success {
            script {
                emailext (
                    to: 'sabeer@cordovacloud.com,haseeb@docme.cloud',
                    subject: "Successful Deployment: ${currentBuild.fullDisplayName}",
                    body: """
                    <p>Project: ${env.JOB_NAME}</p>
                    <p>Build Number: ${env.BUILD_NUMBER}</p>
                    <p>Build Status: ${currentBuild.currentResult}</p>
                    <p>Deployment Date: ${new Date().format("yyyy-MM-dd HH:mm:ss")}</p>
                    <p>Check console output at <a href="${env.BUILD_URL}">${env.BUILD_URL}</a> to view the results.</p>
                    """,
                    mimeType: 'text/html'
                )

                office365ConnectorSend (
                    message: "Successful Deployment: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    status: "SUCCESS",
                    webhookUrl: "https://itcordova.webhook.office.com/webhookb2/963fd9d6-e942-47e6-8eb6-bdc2939bbb1b@c58b1d2f-344a-4d52-9287-24a1fc43ee86/IncomingWebhook/1a83549e9fd94179ac0e8c7c679ea2a1/6d91b428-77bd-4301-a8b4-fadcf9cfb3bb"
                )
            }
        }
        failure {
            script {
                emailext (
                    to: 'sabeer@cordovacloud.com,haseeb@docme.cloud',
                    subject: "Failed Deployment: ${currentBuild.fullDisplayName}",
                    body: """
                    <p>Project: ${env.JOB_NAME}</p>
                    <p>Build Number: ${env.BUILD_NUMBER}</p>
                    <p>Build Status: ${currentBuild.currentResult}</p>
                    <p>Deployment Date: ${new Date().format("yyyy-MM-dd HH:mm:ss")}</p>
                    <p>Check console output at <a href="${env.BUILD_URL}">${env.BUILD_URL}</a> to view the results.</p>
                    """,
                    mimeType: 'text/html'
                )

                office365ConnectorSend (
                    message: "Failed Deployment: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    status: "FAILURE",
                    webhookUrl: "https://itcordova.webhook.office.com/webhookb2/963fd9d6-e942-47e6-8eb6-bdc2939bbb1b@c58b1d2f-344a-4d52-9287-24a1fc43ee86/IncomingWebhook/1a83549e9fd94179ac0e8c7c679ea2a1/6d91b428-77bd-4301-a8b4-fadcf9cfb3bb"
                )
            }
        }
    }
}
