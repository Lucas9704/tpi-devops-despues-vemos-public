pipeline {
    agent { label 'despuesvemos' }
    
    stages {
        stage('Build') {
            steps {
                container('flyway') {
                    script {
                        sh 'flyway info -url="jdbc:mysql://mysql.mysql.svc.cluster.local:3306/prueba" -user=root -password=password'
                        sh 'flyway migrate -locations=filesystem:flyway/sql-migrations-scripts -url="jdbc:mysql://mysql.mysql.svc.cluster.local:3306/prueba" -user=root -password=password'
                        sh 'flyway info -url="jdbc:mysql://mysql.mysql.svc.cluster.local:3306/prueba" -user=root -password=password'
                    }
                }
            }
        }
    }
}