node("slave02") {
  timestamps {
    deleteDir()
    git branch: "release/1.0", url: 'https://git-lab.epsoftinc.in/epsoft-iac/eps-jenkinslib.git'
    load("vars/appPipeline.groovy").build()
  }
}

