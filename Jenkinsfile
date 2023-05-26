node("master") {
  timestamps {
    deleteDir()
    properties ([pipelineTriggers([cron('35 17 * * *')])])
    git branch: "release/1.1", url: 'https://git-lab.epsoftinc.in/epsoft-iac/eps-jenkinslib.git'
    load("vars/appPipeline.groovy").build()
  }
}

