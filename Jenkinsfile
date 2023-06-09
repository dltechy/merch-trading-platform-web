pipeline {
    agent none

    environment {
        BUILDER_CONTAINER_NAME = '$WEB_CONTAINER_NAME-builder'

        ENV_FILENAME = '.env'
    }

    options {
        withFolderProperties()
        skipDefaultCheckout()
    }

    stages {
        stage('Clean workspace (Start)') {
            agent {
                label AGENT_LABEL
            }

            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            agent {
                label AGENT_LABEL
            }

            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: BRANCH]],
                    extensions: [[
                        $class: 'GitLFSPull'
                    ]],
                    userRemoteConfigs: [[
                        credentialsId: 'merch-trading-platform-web-github-deploy-key',
                        url: 'git@github.com:dltechy/merch-trading-platform-web.git'
                    ]]
                ])
            }
        }

        stage('Generate .env') {
            agent {
                label AGENT_LABEL
            }

            steps {
                writeFile file: ENV_FILENAME, text: """\
                    PORT=$WEB_PORT

                    NEXT_PUBLIC_APP_NAME="$APP_NAME"
                    NEXT_PUBLIC_APP_DESCRIPTION="$APP_DESCRIPTION"

                    NEXT_PUBLIC_APP_HOST="$SERVER_URL"
                    """.stripIndent()

                sh 'cat ' + ENV_FILENAME
            }
        }

        stage('Build') {
            agent {
                label AGENT_LABEL
            }

            steps {
                sh 'docker build' +
                    ' --target builder' +
                    ' -t "' + BUILDER_CONTAINER_NAME + '":$BUILD_NUMBER' +
                    ' .'

                sh 'docker build' +
                    ' --build-arg BUILDER_CONTAINER="' + BUILDER_CONTAINER_NAME + '":$BUILD_NUMBER' +
                    ' -t $WEB_CONTAINER_NAME:$BUILD_NUMBER' +
                    ' .'
            }
        }

        stage('Stop & remove old container') {
            agent {
                label AGENT_LABEL
            }

            steps {
                sh 'docker stop $WEB_CONTAINER_NAME || true'
                sh 'docker rm $WEB_CONTAINER_NAME || true'
            }
        }

        stage('Run') {
            agent {
                label AGENT_LABEL
            }

            steps {
                sh 'docker run' +
                    ' --name $WEB_CONTAINER_NAME' +
                    ' --restart unless-stopped' +
                    ' --network $NETWORK_NAME' +
                    ' -d' +
                    ' $WEB_CONTAINER_NAME:$BUILD_NUMBER'
            }
        }

        stage('Delete old images') {
            agent {
                label AGENT_LABEL
            }

            steps {
                sh 'docker rmi \$(docker images "' + BUILDER_CONTAINER_NAME + '" | sed -nr \'/^([^ ]+) +(TAG|\'"$BUILD_NUMBER"\') .*/!s/^([^ ]+) +([^ ]+) .*/\\1:\\2/p\') || true'
                sh 'docker rmi \$(docker images $WEB_CONTAINER_NAME | sed -nr \'/^([^ ]+) +(TAG|\'"$BUILD_NUMBER"\') .*/!s/^([^ ]+) +([^ ]+) .*/\\1:\\2/p\') || true'
            }
        }

        stage('Clean workspace (End)') {
            agent {
                label AGENT_LABEL
            }

            steps {
                cleanWs()
            }
        }
    }
}
