import { Component, forwardRef, Inject, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiAgentFormComponent } from '../../ai-agent-form/ai-agent-form.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { PredefinedBotsService } from 'src/app/pages/services/predefined-bots.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Clipboard } from '@angular/cdk/clipboard';
interface Platform {
  name: string;
  icon: string;
}
@Component({
  selector: 'app-ai-agent-marketing',
  templateUrl: './ai-agent-marketing.component.html',
  styleUrls: ['./ai-agent-marketing.component.css']
})
export class AiAgentMarketingComponent implements OnInit {
  @Input() subAgentName!: string;
  @Input() agentUUID!: string;
  @Input() predefinedBotType!: string;
  @Input() productId!: string;
  @Input() isConfigered: boolean= false;
  @Input() marketingfieldValues: any;
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

  platforms: Platform[] = [
    { name: 'Facebook', icon: 'fab fa-facebook' },
    { name: 'Instagram', icon: 'fab fa-instagram' },
    // { name: 'Twitter', icon: 'fab fa-twitter' },
    // { name: 'LinkedIn', icon: 'fab fa-linkedin' }
  ];
  private apiToken = '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';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService:ToasterService,
    private rest_api: PredefinedBotsService,
    private spinner : LoaderService,
    private clipboard: Clipboard,
    @Inject(forwardRef(() => AiAgentFormComponent)) private parentComponent: AiAgentFormComponent
  ) {
    this.marketingForm = this.fb.group({
      platform: [null, Validators.required],
      facebookPageId: ['', Validators.required],
      facebookToken: ['', Validators.required],
      instagramPageId: ['', Validators.required],
      instagramToken: ['', Validators.required],
      promptType: ['', Validators.required],
      promptDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.platforms.forEach(platform => {
    //   this.marketingForm.get('platforms')?.get(platform.name)?.valueChanges.subscribe(selected => {
    //     this.togglePlatformFields();
    //   });
    // });
    console.log("marketingfieldValues",this.marketingfieldValues);
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
        promptType: this.marketingfieldValues.promptType,
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
      this.generatedText = this.extractContentAndTags(this.marketingfieldValues.generatedText)
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
    console.log('acceptGenerated called in AiAgentMarketingComponent');
    this.spinner.show();
    if (this.marketingForm.valid) {
      const formData = this.marketingForm.value;
      const requestBody = {
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
      if (this.generatedImageUrl) {
        requestBody.fields['generatedImageUrl'] = this.generatedImageUrl;
        this.isAccepted = true;
      }
      // If generatedText exists, map it to the corresponding fields
      // if (this.generatedText.caption || this.generatedText.hashtag) {
      //   requestBody.fields['generatedText'] = {
      //     caption: this.generatedText.caption,
      //     hashtag: this.generatedText.hashtag
      //   };
      //   this.isAccepted = true;
      // }
      
      if (this.generatedText) {
        requestBody.fields['generatedText'] = `${this.generatedText.caption} ${this.generatedText.hashtag}`;
        this.isAccepted = true;
      }
      console.log('Request Body:', requestBody);
      const type = this.isConfigered ? 'update' : 'create';
      this.parentComponent.saveAgentApi(requestBody,type);
      this.spinner.hide();
    } else {
      this.spinner.hide();
      this.toastService.showError('Please fill out the form correctly before submitting.');
    }
  }
  
  clearForm(): void {
    this.marketingForm.reset({
      promptType: 'image'
    });
    this.selectedPlatforms = [];
    this.generatedImageUrl = null;
    this.generatedText = null;
    this.isGenerated = false;
    this.regenerateCount = 0;
  }

  toggleAccepted(): void {
    this.isAccepted = !this.isAccepted;
  }

  // regenerateContent(): void {
  //   const promptType = this.marketingForm.get('promptType')?.value;
  //   const promptDescription = this.marketingForm.get('promptDescription')?.value || 'A dog';
  
  //   if (promptType === 'text') {
  //     this.generateText(promptDescription);
  //   } else if (promptType === 'image') {
  //     this.generateImage(promptDescription);
  //   }
  // }

  onSubmit(): void {
    if (this.marketingForm.valid) {
      const promptType = this.marketingForm.get('promptType')?.value;
      const promptDescription = this.marketingForm.get('promptDescription')?.value;
  
      if (promptType === 'text') {
        this.generateText(promptDescription);
      } else if (promptType === 'image') {
        this.generateImage(promptDescription);
      }
  
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
      // this.hitGenerateCaptionAPI(prompt);
      this.hitGenerateImageAPI(prompt);
    }
  }
  
  hitGenerateCaptionAPI(prompt: string): void {
    this.isLoading = true; 
    this.rest_api.generateCaptionAPI(prompt).subscribe({
      next: (response: any) => {
        console.log('Caption Response:', this.extractContentAndTags(response));
        const filteredResponse = this.extractContentAndTags(response)        
        this.generatedText = {
          caption: this.cleanUpString(filteredResponse.caption),
          hashtag: this.cleanUpString(filteredResponse.hashtag)
        };
        this.isLoading = false;
        this.isGenerated = true;
        if (this.hasGeneratedText) {
          this.getPromtCount(false);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error generating text:', error);
        this.toastService.showError('Error generating text')
      }
    });
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
        console.log('Image Response:', response);
        if (response.image) {
          this.generatedImageUrl = 'data:image/png;base64,' + response.image;
          this.isLoading = false;
          this.isGenerated = true;
          this.getPromtCount(false)
        } 
        // else if (response.url) {
        //   this.generatedImageUrl = response.url;
        // } 
        else {
          this.isLoading = false;
          this.toastService.showError('Unexpected image response format')
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.showError('Error generating image')
      }
    });
  }

  get hasGeneratedText(): boolean {
    return !!this.generatedText && 
           (this.generatedText.caption.trim().length > 0 || 
            this.generatedText.hashtag.trim().length > 0);
  }

  downloadImage() {
    if (this.generatedImageUrl) {
      const link = document.createElement('a');
      link.href = this.generatedImageUrl;
      link.download = 'generated_image.png';
      link.click();
    }
  }
  
  copyText() {
    if (this.hasGeneratedText) {
    const textToCopy = `${this.generatedText.caption}\n${this.generatedText.hashtag}`;
    this.clipboard.copy(textToCopy);
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
  }
}
  getPromtCount(isLimitCheck: boolean) {
    const promptTypeValue = this.marketingForm.get('promptType')?.value ? this.marketingForm.get('promptType')?.value : null;
    this.rest_api.getPromtCount(this.agentUUID, isLimitCheck, promptTypeValue).subscribe(
      (response: any) => {
        console.log("getPromtCount method calling", response);
        if (response) {
          if (promptTypeValue === 'text') {
            // this.regenerateCount = response.textExecutionCountIs;
            if(response.textExecutionCountIs == 3){
              this.regenerateCount = 0
            }
            if(response.textExecutionCountIs == 2){
              this.regenerateCount = 1
            }
            if(response.textExecutionCountIs == 1){
              this.regenerateCount = 2
            }
            if(response.textExecutionCountIs == 0){
              this.regenerateCount = 3
            }
            console.log("this.regenerateCount",this.regenerateCount)
          } else if (promptTypeValue === 'image') {
            if(response.imageExecutionCountIs == 3){
              this.regenerateCount = 0
            }
            if(response.imageExecutionCountIs == 2){
              this.regenerateCount = 1
            }
            if(response.imageExecutionCountIs == 1){
              this.regenerateCount = 2
            }
            if(response.imageExecutionCountIs == 0){
              this.regenerateCount = 3
            }
            // this.regenerateCount = response.imageExecutionCountIs;
          }
          // Disable the "Re-Generate" button if execution count is 0
          // this.isGenerateDisabled = this.regenerateCount === 0;
          this.isGenerateDisabled = this.regenerateCount >= this.maxCount;
          // if (this.regenerateCount < this.maxCount) {
          //   this.regenerateCount++;
          // }
          console.log("Remaining Count:", this.regenerateCount);
          console.log("Is Generate Disabled:", this.isGenerateDisabled);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  togglePlatformFieldsType(){
    console.log("test",this.marketingForm.value.promptType)
    this.getPromtCount(true)
  }

}
