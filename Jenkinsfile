pipeline {
    agent { label 'despuesvemos' }
    options {
        parallelsAlwaysFailFast()
    }
    environment {
        kubernetesServer = "https://10.0.2.15:6443"
        kubernetesToken = credentials('k8s-token')
        dockerhubUsername = "cronozok"
        registryCredential = "dockerhub_id"
        webappBackPodman = 'tpidevopsdespuesvemospublic-back'
        webappFrontPodman = 'tpidevopsdespuesvemospublic-front'
        dockerhubPassword = credentials('dockerhub_password')
		db_host_prod = credentials('db_host_prod')
		db_host_dev = credentials('db_host_dev')
		db_port = credentials('db_port')
		db_user = credentials('db_user')
		db_pass = credentials('db_pass')
		db_db = credentials('db_db')
    }
    stages {
        stage('BuildProjects') {
            steps {
                container('node') {
                    script {
                        sh 'cd backend && npm i && npm run build'
                    }
                }
            }
        }
        stage('Build') {
            parallel {
                stage('Back-end') {
                    steps {
                        echo 'Building back-end...'
                        container('podman') {
                            script {
                                sh 'podman login -u ${dockerhubUsername} -p ${dockerhubPassword} docker.io'
                                sh 'cd backend && podman build -t ${webappBackPodman}:${BUILD_NUMBER} .'
                                if (env.BRANCH_NAME == 'main') {
                                    sh 'podman push ${webappBackPodman}:${BUILD_NUMBER} docker.io/${dockerhubUsername}/${webappBackPodman}:latest'
                                }
                                if (env.BRANCH_NAME == 'dev') {
                                    sh 'podman push ${webappBackPodman}:${BUILD_NUMBER} docker.io/${dockerhubUsername}/${webappBackPodman}:dev'
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('Database-migration') {
            steps {
                echo 'Updating database...'
                container('flyway') {
                    script {
                        if (env.BRANCH_NAME == 'main') {
                            sh 'flyway info -url="jdbc:mysql://${db_host_prod}:${db_port}/${db_db}" -user=${db_user} -password=${db_pass}'
                            sh 'flyway migrate -locations=filesystem:scripts -url="jdbc:mysql://${db_host_prod}:${db_port}/${db_db}" -user=${db_user} -password=${db_pass}'
                            sh 'flyway info -url="jdbc:mysql://${db_host_prod}:${db_port}/${db_db}" -user=${db_user} -password=${db_pass}'
                        }
                        if (env.BRANCH_NAME == 'dev' ) {
                            sh 'flyway info -url="jdbc:mysql://10.96.0.101:3306/${db_db}" -user=${db_user} -password=${db_pass}'
                            sh 'flyway migrate -locations=filesystem:scripts -url="jdbc:mysql://10.96.0.101:3306/${db_db}" -user=${db_user} -password=${db_pass}'
                            sh 'flyway info -url="jdbc:mysql://10.96.0.101:3306/${db_db}" -user=${db_user} -password=${db_pass}'
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                container('kubectl') {
                    script {
                        if (env.BRANCH_NAME == 'main') {
                            sh 'kubectl --server=${kubernetesServer} --token=${kubernetesToken} --insecure-skip-tls-verify apply -f k8s-prod.yml'
							sh 'kubectl --server=${kubernetesServer} --token=${kubernetesToken} --insecure-skip-tls-verify rollout restart deployment/tpidevopsdespuesvemospublic-back  -n tp-devops-prod'
							sh 'kubectl --server=${kubernetesServer} --token=${kubernetesToken} --insecure-skip-tls-verify rollout restart deployment/tpidevopsdespuesvemospublic-front -n tp-devops-prod'
                        }
                        if (env.BRANCH_NAME == 'dev') {
                            sh 'kubectl --server=${kubernetesServer} --token=${kubernetesToken} --insecure-skip-tls-verify apply -f k8s-dev.yml'
							sh 'kubectl --server=${kubernetesServer} --token=${kubernetesToken} --insecure-skip-tls-verify rollout restart deployment/tpidevopsdespuesvemospublic-back  -n tp-devops-dev'
							sh 'kubectl --server=${kubernetesServer} --token=${kubernetesToken} --insecure-skip-tls-verify rollout restart deployment/tpidevopsdespuesvemospublic-front -n tp-devops-dev'
                        }
                        
                    }
                }
            }
        }
    }
}