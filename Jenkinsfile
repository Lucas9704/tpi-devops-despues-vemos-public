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
                        container('docker') {
                            script {
                                webappBack = docker.build("${dockerhubUsername}/tpidevopsdespuesvemospublic-back:${BUILD_NUMBER}", "./backend")
                                docker.withRegistry('', registryCredential) { 
                                    if (env.BRANCH_NAME == 'main') {
                                        webappBack.push('latest')
                                    }
                                    if (env.BRANCH_NAME == 'dev') {
                                        webappBack.push()
                                        webappBack.push('dev')
                                    }
                                }
                            }
                        }
                    }
                }
                stage('Front-end') {
                    steps {
                        echo 'Building front-end...'
                        container('docker') {
                            script {
                                if (env.BRANCH_NAME == 'main') {
                                    webappFront = docker.build("${dockerhubUsername}/tpidevopsdespuesvemospublic-front:${BUILD_NUMBER}", "--build-arg STAGE=prod ./frontend")
                                    docker.withRegistry('', registryCredential) {
                                        webappFront.push('latest')
                                    }
                                }
                                if (env.BRANCH_NAME == 'dev') {
                                    webappFront = docker.build("${dockerhubUsername}/webapp-front:${BUILD_NUMBER}", "--build-arg STAGE=dev ./frontend")
                                    docker.withRegistry('', registryCredential) {
                                        webappFront.push()
                                        webappFront.push('dev')
                                    }
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