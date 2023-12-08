import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import { LoaderService } from "src/app/services/loader/loader.service";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";
declare const CKEDITOR: any;
@Component({
  selector: "app-project-document-editor",
  templateUrl: "./project-document-editor.component.html",
  styleUrls: ["./project-document-editor.component.css"],
})
export class ProjectDocumentEditorComponent implements OnInit {
  public documentData: string;
  public projectName: string;
  public project_id: any;
  public ckeConfig: any;
  public editorRef: any;
  navigarteURL: any;
  paramsData: any;
  entered_folderName: string='';
  isDialog: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private rest_api: RestApiService,
    private loader: LoaderService,
    private toastService: ToasterService,
    private toastMessages: toastMessages
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.paramsData = JSON.parse(atob(params.id));
      this.navigarteURL = this.paramsData.url;
      this.project_id = this.paramsData.projectId;
      this.projectName = this.paramsData.projectName;
      CKEDITOR.replace("project-document-editor",{
        height: 250,
        extraPlugins: 'colorbutton',
        removeButtons: 'PasteFromWord'
      });
      // this.ckeConfig = {
      //   allowedContent: false,
      //   extraPlugins: 'divarea',
      //   forcePasteAsPlainText: true,
      //   removePlugins: 'exportpdf'
      // };
      // DecoupledEditor.create(document.querySelector("#editor"),{
      //   // toolbar: [ 'bold', 'italic', 'undo', 'redo' ]
      //   removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
      // })
      //   .then((editor) => {
      //     // The toolbar needs to be explicitly appended.
      //     document
      //       .querySelector("#toolbar-container")
      //       .appendChild(editor.ui.view.toolbar.element);
      //     this.editorRef = editor;
      //     // window = editor;
      //   })
      //   .catch((error) => {
      //     console.error("There was a problem initializing the editor.", error);
      //   });


    });
  }

  downloadDocument() {
    //this.documentData = this.editorRef.getData();
    this.documentData=CKEDITOR.instances["project-document-editor"].getData()??"";
    asBlob(this.documentData).then((data: any) => {
      saveAs(data, "file.docx"); // save as docx file
    });
  }

  onNavigate() {
    this.router.navigateByUrl(this.navigarteURL);
  }

  uploadFile() {
    this.loader.show();
   // this.documentData = this.editorRef.getData();
   this.documentData=CKEDITOR.instances["project-document-editor"].getData()??"";
   asBlob(this.documentData).then((data: any) => {
      const formData = new FormData();
      formData.append("filePath", data, this.entered_folderName+'.docx');
      formData.append("projectId", this.project_id);
      formData.append("taskId", "");
      formData.append("ChildId", "1");
      formData.append("fileUniqueIds", JSON.stringify([this.paramsData.key]));
      this.rest_api.uploadfilesByProject(formData).subscribe((res) => {
        this.loader.hide();
        this.isDialog = false;
        this.onNavigate();
          this.toastService.showSuccess(this.toastMessages.fileUpldScss,'response'); 
      },err=>{
        this.loader.hide();
          this.toastService.showError(this.toastMessages.uploadError);
      });
    });
  }

  saveDocument() {
    this.isDialog = true;
    this.entered_folderName = "";
  }
}
