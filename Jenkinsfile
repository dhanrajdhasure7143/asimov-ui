node("slave02") {
  timestamps {
    deleteDir()
    properties ([pipelineTriggers([cron('45 13 * * *')])])
    git branch: "release/1.1", url: 'https://git-lab.epsoftinc.in/epsoft-iac/eps-jenkinslib.git'
    load("vars/appPipeline.groovy").build()
  }
}

