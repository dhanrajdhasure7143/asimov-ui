import { Component, ElementRef, forwardRef, Inject, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiAgentFormComponent } from '../../ai-agent-form/ai-agent-form.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { PredefinedBotsService } from 'src/app/pages/services/predefined-bots.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ConfirmationService } from 'primeng/api';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { toastMessages } from 'src/app/shared/model/toast_messages';

interface Platform {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-ai-agent-marketing-new',
  templateUrl: './ai-agent-marketing-new.component.html',
  styleUrls: ['./ai-agent-marketing-new.component.css']
})
export class AiAgentMarketingNewComponent implements OnInit {

  @Input() subAgentName!: string;
  @Input() agentUUID!: string;
  @Input() predefinedBotType!: string;
  @Input() productId!: string;
  @Input() isConfigered: boolean= false;
  @Input() marketingfieldValues: any;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  selectedPlatformsInfo = 'Select the platform where your content will be posted, (Facebook or Instagram).';
  facebookPageIdInfo = 'Enter the unique Page ID for the Facebook page where the content will be posted.';
  facebookTokenInfo = 'Provide the Access Token required to authenticate and post content on the selected Facebook page.';
  instagramPageInfo = 'Enter the unique Page ID for the Instagram account where the content will be posted.';
  instagramTokenInfo = 'Provide the Access Token required to authenticate and post content on the selected Instagram account.';
  promptTypeInfo = 'Choose whether you are entering an image prompt or a text prompt. Based on your choice, enter the content that will generate the image or text to be posted on the selected platforms.';

  marketingForm: FormGroup;
  selectedPlatforms: Platform[] = [];
  generatedImageUrl: string | null = null;
  generatedText: { caption: string; hashtag: string } = {
    caption: '',
    hashtag: ''
  };
  isGenerated: boolean = false;
  regenerateCount: number = 0;
  isAccepted: boolean = false;
  isMarketingAgent = true;
  isLoading: boolean = false;
  isCopied: boolean = false;
  isGenerateDisabled: boolean = false;
  maxCount: number = 3;
  typedCaption: string = '';
  typedHashtags: string = '';
  textRegenerateCount: number = 0;
  imageRegenerateCount: number = 0;
  isAlreadyGenerated=0;
  // Logo Attachment Code 
  isAttachDialogVisible = false;
  isLogoChecked = true;
  isTextChecked = false;
  inputText: string = '';
  logoFile: File | null = null;
  logoPreview: SafeUrl | null = null;
  attachmentType: string = 'logo';
  selectedPosition: string = 'top-right';
  selectedPosition_text: string = 'top-left';
  selectedOption: string;
  generatedImageUrlPlane: string = "";
  generatedCaption: string = "";

  positions: any[] = [
    { label: 'Top-Right', value: 'top-right' },
    { label: 'Top-Left', value: 'top-left' },
    { label: 'Bottom-Right', value: 'bottom-right' },
    { label: 'Bottom-Left', value: 'bottom-left' }
  ];

  positionsForText: any[] = [
    { label: 'Top-Right', value: 'top-right' },
    { label: 'Top-Left', value: 'top-left' },
    { label: 'Bottom-Right', value: 'bottom-right' },
    { label: 'Bottom-Left', value: 'bottom-left' }
  ];
  

  platforms: Platform[] = [
    { name: 'Facebook', icon: 'fab fa-facebook' },
    { name: 'Instagram', icon: 'fab fa-instagram' },
  ];

 

  regenerateOptions = [
    {label: 'Regenerate Image', command: () => {
        this.handleRegenerate("image");
    }
  },
    {label: 'Regenerate Caption', command: () => {
        this.handleRegenerate("caption");
    }
  },
    {label: 'Both', command: () => {
        this.handleRegenerate("both");
    }
  }
];
  private apiToken = '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';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService:ToasterService,
    private rest_api: PredefinedBotsService,
    private spinner : LoaderService,
    private clipboard: Clipboard,
    private confirmationService: ConfirmationService,
    private toastMessages: toastMessages,
    @Inject(forwardRef(() => AiAgentFormComponent)) private parentComponent: AiAgentFormComponent,
    private sanitizer: DomSanitizer

  ) {
    this.marketingForm = this.fb.group({
      platform: [null, Validators.required],
      facebookPageId: ['', Validators.required],
      facebookToken: ['', Validators.required],
      instagramPageId: ['', Validators.required],
      instagramToken: ['', Validators.required],
      // promptType: ['image', Validators.required],
      promptDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.platforms.forEach(platform => {
    //   this.marketingForm.get('platforms')?.get(platform.name)?.valueChanges.subscribe(selected => {
    //     this.togglePlatformFields();
    //   });
    // });
    this.getPromtCount(true);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['marketingfieldValues']) {
      this.updateFormValues();
    }
  }

  updateFormValues() {
    if (this.marketingfieldValues) {
      this.marketingForm.patchValue({
        facebookPageId: this.marketingfieldValues.facebookPageId,
        facebookToken: this.marketingfieldValues.facebookToken,
        instagramPageId: this.marketingfieldValues.instagramPageId,
        instagramToken: this.marketingfieldValues.instagramToken,
        // promptType: this.marketingfieldValues.promptType,
        promptDescription: this.marketingfieldValues.promptDescription

      });

      // Handle selectedPlatforms
      this.selectedPlatforms = [];
      if (this.marketingfieldValues.selectedPlatforms) {
        let selectedPlatformNames: string[];
        try {
          selectedPlatformNames = JSON.parse(this.marketingfieldValues.selectedPlatforms);
        } catch (e) {
          selectedPlatformNames = this.marketingfieldValues.selectedPlatforms.replace(/[\[\]]/g, '').split(',').map(p => p.trim());
        }
        
        this.selectedPlatforms = this.platforms.filter(p => selectedPlatformNames.includes(p.name));
      } else {
        // If no platforms are explicitly selected, infer from the presence of data
        if (this.marketingfieldValues.facebookPageId || this.marketingfieldValues.facebookToken) {
          this.selectedPlatforms.push(this.platforms.find(p => p.name === 'Facebook'));
        }
        if (this.marketingfieldValues.instagramPageId || this.marketingfieldValues.instagramToken) {
          this.selectedPlatforms.push(this.platforms.find(p => p.name === 'Instagram'));
        }
      }

      // Handle generated content
      this.generatedImageUrl = this.marketingfieldValues.generatedImageUrl || '';
      this.generatedText = this.extractContentAndTags(this.marketingfieldValues.generatedCaption)
      this.ai_apiResponse.image = this.marketingfieldValues.generatedImageUrl || '';
      // if (this.generatedText) {
      //   this.typingEffect(this.generatedText.caption, this.generatedText.hashtag, 0);
      // }
      this.generatedCaption = this.marketingfieldValues.generatedCaption || '';

      if (this.generatedText) {
        this.typedCaption = this.generatedText.caption;
        this.typedHashtags = this.generatedText.hashtag;
        this.ai_apiResponse.caption = this.generatedText.caption || '';
        this.ai_apiResponse.hashtag = this.generatedText.hashtag || '';
        this.isContentExists = true;
      }

      // if (this.marketingfieldValues.generatedText) {
      //   const generatedTextObj = this.parseGeneratedText(this.marketingfieldValues.generatedText);
      //   this.generatedText = {
      //     caption: generatedTextObj.caption || '',
      //     hashtag: generatedTextObj.hashtag || ''
      //   };
      // }
      this.isGenerated = !!this.generatedImageUrl || !!this.generatedText.caption;
      this.togglePlatformFields();
    }
  }

  parseGeneratedText(text: string): any {
    return text.replace('{', '').replace('}', '').split(',').reduce((obj, part) => {
      const [key, value] = part.split('=');
      obj[key.trim()] = value.trim();
      return obj;
    }, {});
  }
  
  togglePlatformFields(): void {
    const allPlatforms = ['Facebook', 'Instagram'];
    allPlatforms.forEach(platform => {
      const pageIdControl = this.marketingForm.get(`${platform.toLowerCase()}PageId`);
      const tokenControl = this.marketingForm.get(`${platform.toLowerCase()}Token`);
      const isSelected = this.selectedPlatforms.some(p => p.name === platform);
      
      if (isSelected) {
        pageIdControl?.setValidators([Validators.required]);
        tokenControl?.setValidators([Validators.required]);
      } else {
        pageIdControl?.clearValidators();
        tokenControl?.clearValidators();
        pageIdControl?.reset();
        tokenControl?.reset();
      }
      
      pageIdControl?.updateValueAndValidity();
      tokenControl?.updateValueAndValidity();
      
    });
    
  }

  isPlatformSelected(platformName: string): boolean {
    return this.selectedPlatforms.some(p => p.name === platformName);
  }

  cleanUpString(str: string): string {
    return str
      .replace(/\\"/g, '"')
      .replace(/^"(.*)"$/, '$1')
      .replace(/\\u([\dA-F]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
  }

  acceptGenerated(): void {

    // return
    this.spinner.show();
    if (this.marketingForm.valid) {
      const formData = this.marketingForm.value;
      var  requestBody = {
        isScheduleBot: false,
        fields: {
          ...formData,
        selectedPlatforms: this.selectedPlatforms.map(p => p.name) 
        },
        automationName: this.subAgentName,
        agentUUID: this.agentUUID,
        predefinedBotType: this.predefinedBotType,
        productId: this.productId,
        schedule: "",
      };
      // If generatedImageUrl exists, add it to the request body
      if (this.ai_apiResponse) {
        // Add generatedImageUrl from api response if available
        if (this.ai_apiResponse.image && this.ai_apiResponse.caption) {
          requestBody.fields['generatedImageUrl'] = this.ai_apiResponse.image;
          requestBody.fields['generatedCaption'] = this.generatedCaption;
          this.isAccepted = true;
        }
      }
      const type = this.isConfigered ? 'update' : 'create';
      this.parentComponent.saveAgentApi(requestBody,type);
    } else {
      this.spinner.hide();
      this.toastService.showError('Please fill out the form correctly before submitting.');
    }
  }
  
  clearForm(): void {
    // this.marketingForm.reset({
    //   promptType: 'image'
    // });
    this.selectedPlatforms = [];
    this.generatedImageUrl = null;
    this.generatedText = null;
    this.isGenerated = false;
    this.regenerateCount = 0;
  }

  toggleAccepted(): void {
    this.isAccepted = !this.isAccepted;
  }
  filePath: string | null = null;
  base64String;

  onSubmit(): void {
    if (this.marketingForm.valid) {
      // const promptType = this.marketingForm.get('promptType')?.value;
      // const promptDescription = this.marketingForm.get('promptDescription')?.value;
  
      // if (promptType === 'text') {
      //   this.generateText(promptDescription);
      // } else if (promptType === 'image') {
      //   this.generateImage(promptDescription);
      // }
      // this.scrollToBottom();
      // this.isGenerated = true;
    } else {
      console.error('Form is invalid');
    }
  }
  
  generateText(prompt: string): void {
    if (this.regenerateCount < this.maxCount) {
      this.regenerateCount++;
      this.hitGenerateCaptionAPI(prompt);
    }
  }

  generateImage(prompt: string): void {
    if (this.regenerateCount < this.maxCount) {
      this.regenerateCount++;
      this.hitGenerateImageAPI(prompt);
    }
  }
  
  hitGenerateCaptionAPI(prompt: string): void {
    this.isLoading = true; 
    this.rest_api.generateCaptionAPI(prompt).subscribe({
      next: (response: any) => {
        const filteredResponse = this.extractContentAndTags(response);
        this.generatedCaption = response;

        
        // Append new caption and hashtag to existing ones
        this.ai_apiResponse["caption"] = filteredResponse.caption
        this.ai_apiResponse["hashtag"] = filteredResponse.hashtag
        // this.ai_apiResponse = {
        //   ...this.ai_apiResponse, // Preserve existing image and other properties
        //   caption: this.appendContent(this.ai_apiResponse.caption, this.cleanUpString(filteredResponse.caption)),
        //   hashtag: this.appendContent(this.ai_apiResponse.hashtag, this.cleanUpString(filteredResponse.hashtag))
        // };

        // Trigger typing effect for new content
        this.typingEffect(filteredResponse.caption, filteredResponse.hashtag);
        
        this.isLoading = false;
        this.isGenerated = true;
        this.getPromtCount(false)
        this.isContentExists = true;
        this.isAccepted = false;
        // if (this.hasGeneratedText) {
        //   this.getPromtCount(false);
        // }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error generating text:', error);
        this.toastService.showError('Error generating text');
      }
    });
  }

  // Helper method to append new content
  private appendContent(existing: string | undefined, newContent: string): string {
    if (existing) {
      return `${existing}\n\n${newContent}`.trim();
    }
    return newContent;
  }

  extractContentAndTags(text: string) {
    const hashtagPattern = /#\w+/g;
    const hashtags = text.match(hashtagPattern) || [];
    const content = text.replace(hashtagPattern, '').trim();
    const tags = hashtags.join(' ');
    return {
      caption: content,
      hashtag: tags
    };
  }
  

  hitGenerateImageAPI(prompt: string): void {
    this.isLoading = true;
    this.rest_api.generateImageAPI(prompt).subscribe({
      next: (response: any) => {
        if (response && response.image) {
          this.ai_apiResponse = {
            ...this.ai_apiResponse,  // Preserve existing caption
            image: 'data:image/png;base64,' + response.image,
          };

          this.generatedImageUrlPlane = response.image 
          this.getPromtCount(false);
          this.isContentExists = true;
          this.isAccepted = false;
        } else {
          console.error('Unexpected image response format:', response);
          this.toastService.showError('Unexpected response format. Please try again.');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error generating image:', error);
        this.isLoading = false;
        this.toastService.showError('Error generating image. Please try again.');
      }
    });
  }
  get hasGeneratedText(): boolean {
    return !!this.generatedText && 
           (this.generatedText.caption.trim().length > 0 || 
            this.generatedText.hashtag.trim().length > 0);
  }

  downloadImage() {
    // if (this.generatedImageUrl) {
    //   const link = document.createElement('a');
    //   link.href = this.generatedImageUrl;
    //   link.download = 'generated_image.png';
    //   link.click();
    // }

    if(this.ai_apiResponse?.image){
      const link = document.createElement('a');
      link.href = this.ai_apiResponse.image;
      link.download = 'generated_image.png';
      link.click();

      // this.toastService.toastSuccess("Image Downloaded Successfully..")
    }


  }
  
  copyText() {
    if (this.ai_apiResponse.caption) {
    const textToCopy = `${this.ai_apiResponse.caption} \n ${this.ai_apiResponse.hashtag}`;
    this.clipboard.copy(textToCopy);
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
    }
    }

  // getPromtCount(isLimitCheck: boolean) {
  //   // const promptTypeValue = this.marketingForm.get('promptType')?.value || null;
  //   const promptTypeValue = "both";
  //   this.rest_api.getPromtCount(this.agentUUID, isLimitCheck, promptTypeValue).subscribe(
  //     (response: any) => {
  //       if (response) {
  //         // Store regenerate count for both text and image
  //         this.textRegenerateCount = this.calculateRegenerateCount(response.textExecutionCountIs);
  //         this.imageRegenerateCount = this.calculateRegenerateCount(response.imageExecutionCountIs);
  //         this.isAlreadyGenerated = this.textRegenerateCount + this.imageRegenerateCount;

  //         // Update regenerate count and button visibility
  //         // this.regenerateCount = (promptTypeValue === 'text') ? this.textRegenerateCount : this.imageRegenerateCount;
  //         // this.isGenerateDisabled = this.regenerateCount >= this.maxCount;

  //         // // Update isGenerated to be true if either text or image has been generated, or if we've switched prompt types
  //         // if (promptTypeValue === 'text') {
  //         //   this.isGenerated = this.textRegenerateCount > 0;
  //         // }

  //         // if (promptTypeValue === 'image') {
  //         //   this.isGenerated =this.imageRegenerateCount > 0;
  //         // }
  //         // this.isGenerated = this.textRegenerateCount > 0 || this.imageRegenerateCount > 0;
  //       }
  //     },
  //     (error) => {
  //       this.toastService.showError("Error occurred fetching prompt limit check");
  //     }
  //   );
  // }

  getPromtCount(isLimitCheck: boolean) {
    const promptTypeValue = "both";
    this.rest_api.getPromtCount(this.agentUUID, isLimitCheck, promptTypeValue).subscribe((response: any) => {
        if (response) {
          this.regenerateCount = this.calculateRegenerateCount(response.bothExecutionCountIs);
          
          this.isGenerateDisabled = this.regenerateCount >= this.maxCount;
          
          this.isGenerated = this.regenerateCount > 0;

        }
      },(error) => {
        this.toastService.showError("Error occurred fetching prompt limit check");
      }
    );
  }

  calculateRegenerateCount(apiCount: number): number {
    const maxCount = 3;  // Maximum allowed executions
    return maxCount - apiCount; // Reverse the count for display
  }

  togglePlatformFieldsType(){
    this.getPromtCount(true)
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error("Scroll Error: ", err);
    }
  }

  // eanble this for combined text----------------

  // typeText(fullText: string, delay = 50): void {
  //   let index = 0;
  //   this.typedCaption = ''; // Initialize the typedCaption field
  //   const interval = setInterval(() => {
  //     if (index < fullText.length) {
  //       this.typedCaption += fullText.charAt(index); // Append each character to the typedCaption
  //       index++;
  //       // Scroll to bottom as text is typed
  //       this.scrollToBottom();
  //     } else {
  //       clearInterval(interval); // Stop typing when the entire text is done
  //     }
  //   }, delay);
  // }
  

  typingEffect(caption: string, hashtags: string, delay = 50): void {
    let fullText = caption + '\n' + hashtags;
    let index = 0;
    this.typedCaption = '';
    this.typedHashtags = '';
    const interval = setInterval(() => {
      if (index < fullText.length) {
        if (index < caption.length) {
          this.typedCaption += fullText.charAt(index);
        } else {
          this.typedHashtags += fullText.charAt(index);
        }
        index++;
        // this.scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, delay);
  }

  confirmRegenerate() {
    const promptType = "image";
    const message = promptType === 'image' 
      ? 'Regenerating the image will cause you to lose the previously generated image.'
      : 'Regenerating the text will cause you to lose the previously generated text.';
      this.confirmationService.confirm({
      message: message + ' Are you sure you want to continue?',
      header: "Confirmation",
      acceptLabel: "Yes",
      rejectLabel: "No",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.onSubmit();
      },
      reject: () => {
        // Optional: Handle rejection
      }
    });
  }

  showAttachDialog(){
    this.isAttachDialogVisible = true;
  }

  onLogoFileSelect(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['image/png'];

    if (file && allowedTypes.includes(file.type)) {
      this.logoFile = file;
    } else {
      this.toastService.showWarn("Only PNG formats are allowed for the logo.");
    }

    this.checkFormValidity();
  }

  checkFormValidity() {
    const isLogoSelected = this.attachmentType === 'logo' && !this.logoFile;
    const isTextEmpty = this.attachmentType === 'text' && !this.inputText;

    return isLogoSelected || isTextEmpty;
  }

  isSubmitDisabled(): boolean {
    return (
      (this.attachmentType === 'logo' && !this.logoFile) ||
      (this.attachmentType === 'text' && !this.inputText) ||
      this.attachmentType === ''
    );
  }

  async submitAttachment() {
    if (this.attachmentType === 'logo' && !this.logoFile) {
      return;
    }

    if (this.attachmentType === 'text' && !this.inputText) {
      return;
    }

    if (this.generatedImageUrlPlane?.startsWith('data:image/png;base64,')) {
      this.generatedImageUrlPlane = this.generatedImageUrlPlane.replace('data:image/png;base64,', '');
    }
  
    let imagePayload = '';
    if (this.ai_apiResponse.image.startsWith('data:image/png;base64,')) {
      imagePayload = this.ai_apiResponse?.image.replace('data:image/png;base64,', '');
    }

    const formData = new FormData();
    formData.append('position', this.selectedPosition);
    formData.append('image', imagePayload);

    if (this.attachmentType === 'logo' && this.logoFile) {
      try {
        const base64String = await this.convertFileToBase64(this.logoFile);
        
        formData.append('logo_path', base64String);
        formData.append('text', '');
      } catch (error) {
        console.error('Error converting logo file:', error);
        this.toastService.showError('Error processing logo file');
        return;
      }
    }
    if (this.attachmentType === 'text' && this.inputText) {
      formData.append('text', this.inputText);
      formData.append('logo_path', '');
    }

    this.spinner.show();
      this.rest_api.appendLogo(formData).subscribe(
        (response: any) => {
          if (response) {
            setTimeout(() => {
              if (response.image) {
                this.generatedImageUrl= 'data:image/png;base64,' + response.image
                this.ai_apiResponse = {
                  ...this.ai_apiResponse,
                  image: 'data:image/png;base64,' + response.image,
                };
              }
              this.spinner.hide();
            }, 2000);
            this.isAccepted = false;
            this.toastService.toastSuccess(`Successfully appended ${this.attachmentType}.`);
  
          }
  
          this.spinner.hide();
        },
        (error) => {
          this.toastService.showError('Error occurred fetching prompt limit check');
          this.spinner.hide();
        }
      );
  
    const entries = (formData as any).entries();
    for (const [key, value] of entries) {
      console.log(`${key}:`, value);
    }
    this.isAttachDialogVisible = false;
    this.resetForm();
  }
  
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Remove the data URL prefix
        resolve(base64String);
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        reject(error);
      };
    });
  }

  resetForm() {
    this.attachmentType = 'logo';
    this.inputText = '';
    this.logoFile = null;
    this.logoPreview = null;
    this.selectedPosition = 'top-right';
  }

  // convertFileToBase64(file: File): void {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);

  //   reader.onload = () => {
  //     this.base64String = reader.result as string;
  //   };

  //   this.base64String = this.base64String.replace('data:image/png;base64,', '');

  //   reader.onerror = (error) => {
  //     console.error('File reading error:', error);
  //   };
  // }



  // New Code 
  // ai_prompt: string = '';
  // ai_apiResponse: any;
  isContentExists:boolean=false;
  ai_apiResponse: {
    image?: string;
    caption?: string;
    hashtag?: string;
  } = {};
  showDropdown: boolean = false;

  ai_generateContent(){
    
    if (!this.marketingForm.value.promptDescription) {
      this.toastService.showWarn("Please enter a prompt")
      return;
    }
      this.isLoading = true;
      const promptDescription = this.marketingForm.value.promptDescription;
      this.rest_api.generateCaptionImage(promptDescription).subscribe({
        next: (response: any) => {
          if (response.image || response.caption) {
            this.ai_apiResponse = {
              // ...this.ai_apiResponse,  // Keep any existing data
              // caption: response.caption,
              image: 'data:image/png;base64,' + response.image,  // If using base64 image
            };
            this.generatedCaption = response.caption;
            this.generatedText = this.extractContentAndTags(response.caption)
            if (this.generatedText) {
              this.ai_apiResponse.caption = this.generatedText.caption || '';
              this.ai_apiResponse.hashtag = this.generatedText.hashtag || '';
            }
            this.getPromtCount(false)
            this.isLoading = false;
            this.isGenerated = true;
            this.isContentExists = true
            this.isAccepted = false;
          }else {
            this.isLoading = false;
            this.toastService.showError(this.toastMessages.apierror)
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toastService.showError(this.toastMessages.apierror)
        }
      });
  
    // let mockResponse = {
    //   // "image": "https://images.pexels.com/photos/268432/pexels-photo-268432.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   "image": "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   "text": "Explore the rich cultural heritage and diverse landscapes of India. From the majestic Taj Mahal to the serene backwaters of Kerala, India offers a unique travel experience for every type of tourist. Discover the vibrant markets, delicious cuisine, and welcoming hospitality that make India a must-visit destination."
    // }
    // this.spinner.show();
    // setTimeout(() => {
    //   this.ai_apiResponse = mockResponse;
    //   this.spinner.hide();
    // }, 1000);
  }

  ai_download() {
  }

  ai_customize() {
  }

  ai_accept() {
  }

  ai_regenerate(type: string) {
    this.showDropdown = false;
  }

  handleRegenerate(value: string): void {
    // Show confirmation dialog before proceeding
    let message = this.getConfirmationMessage(value);
    
    this.confirmationService.confirm({
      message: message,
      header: 'Confirm Regenerate',
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        // Call respective methods after confirmation
        switch (value) {
          case 'image':
            this.hitGenerateImageAPI(this.marketingForm.value.promptDescription);
            break;
          case 'caption':
            this.hitGenerateCaptionAPI(this.marketingForm.value.promptDescription);
            break;
          case 'both':
            this.ai_generateContent();
            break;
        }
      },
      reject: () => {
      }
    });
  }

  getConfirmationMessage(value: string): string {
    switch (value) {
      case 'image':
        return 'Regenerating will cause you to lose the previously generated image. Are you sure you want to regenerate?';
      case 'caption':
        return 'Regenerating will cause you to lose the previously generated caption. Are you sure you want to regenerate?';
      case 'both':
        return 'Regenerating will cause you to lose the previously generated image and caption. Are you sure you want to regenerate?';
      default:
        return 'Are you sure you want to regenerate?';
    }
  }
}
