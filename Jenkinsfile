node("slave02") {
  timestamps {
    deleteDir()
    properties ([pipelineTriggers([cron('02 23 * * *')])])
    git branch: "release/dev", url: 'https://git-lab.epsoftinc.in/epsoft-iac/eps-jenkinslib.git'
    load("vars/appPipeline.groovy").build()
  }
}

