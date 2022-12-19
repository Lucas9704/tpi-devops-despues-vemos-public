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
        webappBack = ""
        webappFront = ""
        webappBackPodman = 'tpidevopsdespuesvemospublic-back:${BUILD_NUMBER}'
        webappFrontPodman = 'tpidevopsdespuesvemospublic-front:${BUILD_NUMBER}'
        dockerhubPassword = credentials('dockerhub_password')
		/* db_host_prod = credentials('db_host_prod')
		db_host_dev = credentials('db_host_dev')
		db_port = credentials('db_port')
		db_user = credentials('db_user')
		db_pass = credentials('db_pass')
		db_db = credentials('db_db') */
    }
    stages {
        stage('Build') {
            parallel {
                stage('Back-end') {
                    steps {
                        echo 'Building back-end...'
                        /* container('docker') {
                            script {
                                webappBack = docker.build("${dockerhubUsername}/tpidevopsdespuesvemospublic-back:${BUILD_NUMBER}", "./backend")
                                docker.withRegistry('https://registry.hub.docker.com', registryCredential) { 
                                    if (env.BRANCH_NAME == 'main') {
                                        webappBack.push('latest')
                                    }
                                    if (env.BRANCH_NAME == 'dev') {
                                        webappBack.push()
                                        webappBack.push('dev')
                                    }
                                }
                            }
                        } */
                        container('podman') {
                            script {
                                sh 'podman login -u ${dockerhubUsername} -p ${dockerhubPassword} docker.io'
                                sh 'cd backend'
                                sh 'podman build -t ${webappBackPodman} .'
                                if (env.BRANCH_NAME == 'main') {
                                    sh 'podman push ${webappBackPodman} docker.io/${dockerhubUsername}/${webappBackPodman}:latest'
                                }
                                if (env.BRANCH_NAME == 'dev') {
                                    sh 'podman push ${webappBackPodman} docker.io/${dockerhubUsername}/${webappBackPodman}:dev'
                                }
                            }
                        }
                    }
                }
                stage('Front-end') {
                    steps {
                        echo 'Building front-end...'
                        /* container('docker') {
                            script {
                                if (env.BRANCH_NAME == 'main') {
                                    webappFront = docker.build("${dockerhubUsername}/tpidevopsdespuesvemospublic-front:${BUILD_NUMBER}", "--build-arg STAGE=prod ./frontend")
                                    docker.withRegistry('https://registry.hub.docker.com', registryCredential) {
                                        webappFront.push('latest')
                                    }
                                }
                                if (env.BRANCH_NAME == 'dev') {
                                    webappFront = docker.build("${dockerhubUsername}/webapp-front:${BUILD_NUMBER}", "--build-arg STAGE=dev ./frontend")
                                    docker.withRegistry('https://registry.hub.docker.com', registryCredential) {
                                        webappFront.push()
                                        webappFront.push('dev')
                                    }
                                }
                            }
                        } */
                        container('podman') {
                            script {
                                sh 'podman login -u ${dockerhubUsername} -p ${dockerhubPassword} docker.io'
                                sh 'cd frontend'
                                if (env.BRANCH_NAME == 'main') {
                                    sh 'podman build -t ${webappFrontPodman} --build-arg=STAGE=prod .'
                                    sh 'podman push ${webappFrontPodman} docker.io/${dockerhubUsername}/${webappFrontPodman}:latest'
                                }
                                if (env.BRANCH_NAME == 'dev') {
                                    sh 'podman build -t ${webappFrontPodman} --build-arg=STAGE=dev .'
                                    sh 'podman push ${webappFrontPodman} docker.io/${dockerhubUsername}/${webappFrontPodman}:dev'
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('Database-migration') {
            steps {
                script {
                    sh 'git clone https://github.com/devops-frre/tpi-2022-despues-vemos.git'
                }
                echo 'Updating database...'
                container('flyway') {
                    script {
                        sh 'flyway info -url="jdbc:mysql://mysql.mysql.svc.cluster.local:3306/prueba" -user=root -password=password'
                        sh 'flyway migrate -locations=filesystem:scripts -url="jdbc:mysql://mysql.mysql.svc.cluster.local:3306/prueba" -user=root -password=password'
                        sh 'flyway info -url="jdbc:mysql://mysql.mysql.svc.cluster.local:3306/prueba" -user=root -password=password'
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