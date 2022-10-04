import { RestApiService } from './../../../services/rest-api.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, EventEmitter, Output, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-rpa-environment-form',
  templateUrl: './rpa-environment-form.component.html',
  styleUrls: ['./rpa-environment-form.component.css'],
})
export class RpaEnvironmentFormComponent implements OnInit {
  @Input() isCreate: boolean;
  @Input() updateenvdata: any;
  @Input("categoriesList") categoriesList: any[];
  public environmentName: FormControl;
  public environmentForm: FormGroup;
  public submitted: Boolean;
  public toggle: Boolean;
  public passwordtype1: Boolean;
  public passwordtype2: Boolean;
  public isKeyValuePair: Boolean = false;
  public password: any = "";
  public keyValueFile: File;

  constructor(private api: RestApiService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.environmentForm = this.formBuilder.group({
      environmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      environmentType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      agentPath: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      hostAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)")])],
      categoryId: ["0", Validators.compose([Validators.required])],
      username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      connectionType: ["SSH", Validators.compose([Validators.required, , Validators.maxLength(50), Validators.pattern("[A-Za-z]*")])],
      portNumber: ["22", Validators.compose([Validators.required, Validators.maxLength(4)])],
      activeStatus: [true]
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isCreate && this.updateenvdata) {
      this.environmentForm.get("environmentName").setValue(this.updateenvdata["environmentName"]);
      this.environmentForm.get("environmentType").setValue(this.updateenvdata["environmentType"]);
      this.environmentForm.get("agentPath").setValue(this.updateenvdata["agentPath"]);
      this.environmentForm.get("categoryId").setValue(this.updateenvdata["categoryId"]);
      this.environmentForm.get("hostAddress").setValue(this.updateenvdata["hostAddress"]);
      this.environmentForm.get("username").setValue(this.updateenvdata["username"]);
      if (this.updateenvdata.keyValue == null) {
        this.password = (this.updateenvdata["password"].password);
      } else {
        this.isKeyValuePair = true;
        this.keyValueFile = this.updateenvdata["keyValue"]
      }
      //this.environmentForm.get("password").setValue(this.updateenvdata["password"]);
      this.environmentForm.get("connectionType").setValue(this.updateenvdata["connectionType"]);
      this.environmentForm.get("portNumber").setValue(this.updateenvdata["portNumber"]);
      if (this.updateenvdata.activeStatus == 7) {
        this.toggle = true;
        this.environmentForm.get("activeStatus").setValue(true);
      } else {
        this.toggle = false;
        this.environmentForm.get("activeStatus").setValue(false);
      }
    } else {
      this.environmentForm = this.formBuilder.group({
        environmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        environmentType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        agentPath: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)")])],
        categoryId: ["0", Validators.compose([Validators.required])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        connectionType: ["SSH", Validators.compose([Validators.required, , Validators.maxLength(50), Validators.pattern("[A-Za-z]*")])],
        portNumber: ["22", Validators.compose([Validators.required, Validators.maxLength(4)])],
        activeStatus: [true]
      })
      this.environmentForm.get("categoryId").setValue(this.categoriesList.length == 1 ? this.categoriesList[0].categoryId : "0")
    }
  }

  ngOnInit() {
    this.spinner.show();
    this.passwordtype1 = false;
    this.passwordtype2 = false;
  }

  setPort() {
    if (this.environmentForm.value.environmentType == "Windows") {
      this.environmentForm.get("portNumber").setValue("44");
    } else if (this.environmentForm.value.environmentType == "Linux") {
      this.environmentForm.get("portNumber").setValue("22");
    }
  }

  resetEnvForm() {
    this.environmentForm.reset();
    this.password = null;
    this.isKeyValuePair = false;
    this.environmentForm.get("portNumber").setValue("22");
    this.environmentForm.get("connectionType").setValue("SSH");
    this.environmentForm.get("categoryId").setValue(this.categoriesList.length == 1 ? this.categoriesList[0].categoryId : '0');
    this.environmentForm.get("environmentType").setValue("");
    this.environmentForm.get("activeStatus").setValue(true);
    this.passwordtype1 = false;
  }

  async testConnection() {
    if (this.environmentForm.valid) {
      let envFormValue: any = this.environmentForm.value
      if (envFormValue.activeStatus == true) {
        envFormValue.activeStatus = 7
      } else {
        envFormValue.activeStatus = 8
      }
      if (this.isKeyValuePair == false) {
        let connectionDetails = JSON.parse(JSON.stringify(envFormValue));
        connectionDetails["password"] = this.password;
        this.spinner.show();
        await this.api.testenvironment(connectionDetails).subscribe(res => {
          this.spinner.hide();
          if (res.errorMessage == undefined) {
            Swal.fire("Success", "Successfully Connected", "success")
          } else {
            Swal.fire("Error", "Connection Failed", "error")
          }
        }, err => {
          this.spinner.hide()
          Swal.fire("Error", "Unable to test connections", "error");
        });
        this.activestatus();
      } else {
        this.spinner.hide()
        Swal.fire("Alert", "Test connections for key pair authentication is not configured", "warning")
      }
    } else {
      this.spinner.hide();
      this.activestatus();
    }
  }

  activestatus() {
    if (this.environmentForm.value.activeStatus == 7) {
      this.environmentForm.value.activeStatus = true;
    } else {
      this.environmentForm.value.activeStatus = false;
    }
  }

  saveEnvironmentV2() {
    if (this.environmentForm.value.activeStatus == true) {
      this.environmentForm.value.activeStatus = 7
    } else {
      this.environmentForm.value.activeStatus = 8
    }
    this.environmentForm.value.createdBy = "admin";
    this.submitted = true;
    let environment = this.environmentForm.value;
    let formData = new FormData();
    Object.keys(environment).forEach(key => {
      formData.append(key, environment[key])
    });
    if (this.isKeyValuePair == true) {
      formData.append("key", this.keyValueFile);
      this.password = "";
    } else {
      formData.append("password", this.password);
    }
    this.spinner.show();
    this.api.addenvironmentV2(formData).subscribe((response: any) => {
      this.spinner.hide();
      if (response.errorMessage == undefined) {
        Swal.fire("Success", response.status, "success")
        document.getElementById("createenvironment").style.display = 'none';
        this.environmentForm.reset();
        this.environmentForm.get("portNumber").setValue("22");
        this.environmentForm.get("connectionType").setValue("SSH");
        this.environmentForm.get("activeStatus").setValue(true);
        this.isKeyValuePair = false;
        this.password = "";
        this.keyValueFile = undefined;
        this.submitted = false;
      } else {
        this.submitted = false;
        Swal.fire("Error", response.errorMessage, "error");
      }
    }, err => {
      this.spinner.hide();
      Swal.fire("Error", "Unable to add environment", "error");
      this.submitted = false;
    });
  }

  downloadKey(environmentName, fileData) {
    if (fileData != null) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
      element.setAttribute('download', `${environmentName}-Key.ppk`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
    } else {
      Swal.fire("Error", "Unable to download .ppk file", "error")
    }
  }

  async updateEnvironmentV2() {
    if (this.environmentForm.valid) {
      this.spinner.show();
      if (this.environmentForm.value.activeStatus == true) {
        this.environmentForm.value.activeStatus = 7
      } else {
        this.environmentForm.value.activeStatus = 8
      }
      let updatFormValue = this.environmentForm.value;
      updatFormValue["environmentId"] = this.updateenvdata.environmentId;
      updatFormValue["createdBy"] = this.updateenvdata.createdBy;
      updatFormValue["deployStatus"] = this.updateenvdata.deployStatus;
      let updateEnvData = new FormData();
      Object.keys(updatFormValue).map(key => {
        return updateEnvData.append(String(key), String(updatFormValue[key]))
      });
      updateEnvData.append("formValue", "sample")
      if (this.isKeyValuePair == false) {
        updateEnvData.append("password", this.password);
        updateEnvData.append("key", null)
      } else {
        updateEnvData.append("password", null)
        if (this.keyValueFile == undefined || this.keyValueFile == null)
          updateEnvData.append("key", null)
        else
          updateEnvData.append("key", this.keyValueFile)
      }
      await this.api.updateEnvironmentV2(updateEnvData).subscribe(res => {
        let response: any = res;
        this.spinner.hide();
        if (response.errorMessage == undefined) {
          Swal.fire("Success", res.status, "success")
          document.getElementById("update-popup").style.display = 'none';
        } else {
          Swal.fire("Error", response.errorMessage, "error")
        }
      }, err => {
        this.spinner.hide();
        Swal.fire("Error", "Unable to update environment details", "error")
      });
    } else {
      this.spinner.hide();
      Swal.fire("Alert", "Update Environment is not configured for key pair authentication", "warning");
    }
  }

  submitEnvironmentForm() {
    if (this.isCreate == true)
      this.saveEnvironmentV2()
    else
      this.updateEnvironmentV2();
  }

  keypair(event) {
    this.isKeyValuePair = !this.isKeyValuePair;
    if (event.target.checked == true) {
      if (this.updateenvdata.password.password != undefined) {
        this.password = this.updateenvdata.password.password
      }
      else {
        this.password = ''
      }
      if (this.keyValueFile == undefined) {
        this.keyValueFile = undefined
      } else {
        this.keyValueFile = this.updateenvdata.keyValue
      }
    } else {
      if (this.keyValueFile == undefined) {
        this.keyValueFile = undefined
      }
      if (this.updateenvdata.password.password != undefined) {
        this.password = this.updateenvdata.password.password
      } else {
        this.password = ''
      }
    }
  }

  onlyAlphabetsAllowed(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode
    if (charCode > 31 && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false
    }
    return true
  }

  onlyNumbersAllowed(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode
    if (charCode != 43 && charCode != 45 && charCode != 46 && charCode != 69 && charCode != 101) {
      return true
    }
    return false
  }

}