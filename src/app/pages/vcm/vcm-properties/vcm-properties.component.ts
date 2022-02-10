import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vcm-properties',
  templateUrl: './vcm-properties.component.html',
  styleUrls: ['./vcm-properties.component.css']
})
export class VcmPropertiesComponent implements OnInit {

  vcmProperties = [];
  documents: any;
  fileName = [];
  managementOwner: any;
  coreOwner: any;
  supportOwner: any;
  managementDescription: any;
  coreDescription: any;
  supportDescription: any;
  levelType : any;


  constructor(private router: Router,private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(res=>{
      console.log(res);
      this.levelType = res.level
    });
  }

  ngOnInit(): void {
    this.vcmProperties = JSON.parse(sessionStorage.getItem('vcmTree'));
    console.log(this.vcmProperties);
  }

  saveProperties(){
    console.log(this.vcmProperties);
  }

  // owner(prop, owner) {
  //   console.log(prop, owner);
  //   if (prop.name == 'Management Process') {
  //     this.managementOwner = owner;
  //   }
  //   else if (prop.name == 'Core Process') {
  //     this.coreOwner = owner;
  //   }
  //   else if (prop.name == 'Support Process') {
  //     this.supportOwner = owner;
  //   }
  // }

  // documentsUpload(event) {
  //   console.log(event);
  //   for (var i = 0; i < event.target.files.length; i++) {
  //     event.target.files[i]['convertedsize'] = this.convertFileSize(event.target.files[i].size);
  //     this.fileName.push(event.target.files[i]);
  //   }
  //   const formdata = new FormData();
  //   for (var i = 0; i < this.fileName.length; i++) {
  //     formdata.append("file", this.fileName[i]);
  //   }
  //   console.log(this.fileName);
  // }
  // convertFileSize(e) {
  //   let divided_size: any = String(e / 1024)
  //   if (e / 1024 <= 1024) {
  //     if (divided_size.includes('.')) {
  //       return divided_size.split('.')[0] + ' KB'
  //     } else {
  //       return divided_size + ' KB';
  //     }
  //   } else {
  //     let size1: any = String(divided_size / 1024)
  //     if (size1.includes('.')) {
  //       return size1.split('.')[0] + ' MB'
  //     } else {
  //       return size1 + ' MB';
  //     }
  //   }
  // }

  // description(prop,value){
  //   console.log(prop,value);
  //   if (prop.name == 'Management Process') {
  //     this.managementDescription = value;
  //   }
  //   else if (prop.name == 'Core Process') {
  //     this.coreDescription = value;
  //   }
  //   else if (prop.name == 'Support Process') {
  //     this.supportDescription = value;
  //   }
  // }
  // RemoveFile(file, i: number) {
  //   this.fileName.splice(i, 1);
  // }

  // saveProperties() {
  //   if (this.managementOwner) {
  //     this.vcmProperties[0].owner = this.managementOwner;
  //   }
  //   if (this.coreOwner) {
  //     this.vcmProperties[1].owner = this.coreOwner;
  //   }
  //   if (this.supportOwner) {
  //     this.vcmProperties[2].owner = this.supportOwner;
  //   }
  //   if (this.managementDescription) {
  //     this.vcmProperties[0].description = this.managementDescription;
  //   }
  //   if (this.coreDescription) {
  //     this.vcmProperties[1].description = this.coreDescription;
  //   }
  //   if (this.supportDescription) {
  //     this.vcmProperties[2].description = this.supportDescription;
  //   }
  //   const formdata = new FormData();
  //   for (var i = 0; i < this.fileName.length; i++) {
  //     formdata.append("file", this.fileName[i]);
  //   }
  //   console.log(this.fileName);
  //   this.vcmProperties[4].documents = (this.fileName);
  //   this.router.navigate(['/pages/vcm/view-vcm']);
  //   sessionStorage.setItem('vcmTree', JSON.stringify(this.vcmProperties));
  // }

  // resetProperties(){
  //   this.managementOwner = "";
  //   this.coreOwner = "";
  //   this.supportOwner = "";
  //   this.managementDescription ="";
  //   this.coreDescription = "";
  //   this.supportDescription = "";
  //   this.fileName = []
  // }

  removeSession() {
    sessionStorage.removeItem('vcmTree');
  }
}
