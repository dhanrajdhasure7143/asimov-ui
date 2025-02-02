import { Directive, Input, ElementRef } from "@angular/core";
import { CdkDrag } from "@angular/cdk/drag-drop";

@Directive({
    selector: "[cdkdirective]"
})
export class CdkDirective {
    @Input("cdkdirective") scrollContainer: HTMLElement;
    originalElement: ElementRef<HTMLElement>;

    constructor(cdkDrag: CdkDrag) {
        cdkDrag._dragRef.beforeStarted.subscribe(() => {
            const cdkDropList = cdkDrag.dropContainer;
            if (!this.originalElement) {
                this.originalElement = cdkDropList.element;
            }
            if (this.scrollContainer) {
                const element = this.scrollContainer;
                cdkDropList._dropListRef.element = element;
                cdkDropList.element = new ElementRef<HTMLElement>(element);
            } else {
                cdkDropList._dropListRef.element = cdkDropList.element.nativeElement;
                cdkDropList.element = this.originalElement;
            }
        });
    }
}
