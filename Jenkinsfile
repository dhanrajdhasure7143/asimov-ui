node("slave02") {
  timestamps {
    deleteDir()
    properties ([pipelineTriggers([cron('35 17 * * *')])])
    git branch: "release/dev", url: 'https://git-lab.epsoftinc.in/epsoft-iac/eps-jenkinslib.git'
    load("vars/appPipeline.groovy").build()
  }
}

