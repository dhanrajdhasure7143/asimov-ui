import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TriStateCheckboxModule } from "primeng/tristatecheckbox";
import { CheckboxModule } from "primeng/checkbox";
import { ListboxModule } from "primeng/listbox";
import { CardModule } from "primeng/card";
import { TabViewModule } from "primeng/tabview";
import { MenuModule } from "primeng/menu";
import { SplitterModule } from "primeng/splitter";
import { SidebarModule } from "primeng/sidebar";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { CalendarModule } from "primeng/calendar";
import { SliderModule } from "primeng/slider";
import { MultiSelectModule } from "primeng/multiselect";
import { ContextMenuModule } from "primeng/contextmenu";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { ProgressBarModule } from "primeng/progressbar";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MessageModule } from "primeng/message";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InplaceModule } from "primeng/inplace";
import { EditorModule } from "primeng/editor";
import { TreeModule } from "primeng/tree";
import { RadioButtonModule } from "primeng/radiobutton";
import { ImageModule } from "primeng/image";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ChipsModule } from "primeng/chips";
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from "primeng/api";
import {KnobModule} from 'primeng/knob';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TriStateCheckboxModule,
    CheckboxModule,
    ListboxModule,
    CardModule,
    TabViewModule,
    MenuModule,
    SplitterModule,
    SidebarModule,
    OverlayPanelModule,
    TableModule,
    ToastModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    ConfirmDialogModule,
    EditorModule,
    MessageModule,
    FileUploadModule,
    InputTextareaModule,
    InplaceModule,
    TreeModule,
    RadioButtonModule,
    InputTextareaModule,
    AutoCompleteModule,
    ChipsModule,
    ConfirmPopupModule,
    KnobModule,
    TooltipModule
  ],
  exports: [
    CommonModule,
    TriStateCheckboxModule,
    CheckboxModule,
    ListboxModule,
    CardModule,
    TabViewModule,
    MenuModule,
    SplitterModule,
    SidebarModule,
    OverlayPanelModule,
    TableModule,
    ToastModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    ConfirmDialogModule,
    EditorModule,
    MessageModule,
    FileUploadModule,
    InputTextareaModule,
    InplaceModule,
    TreeModule,
    RadioButtonModule,
    MessageModule,
    ImageModule,
    AutoCompleteModule,
    ChipsModule,
    ConfirmPopupModule,
    KnobModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class PrimengCustomModule {}
