import { Component, forwardRef, Inject, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiAgentFormComponent } from '../../ai-agent-form/ai-agent-form.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { PredefinedBotsService } from 'src/app/pages/services/predefined-bots.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
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
    @Inject(forwardRef(() => AiAgentFormComponent)) private parentComponent: AiAgentFormComponent
  ) {
    this.marketingForm = this.fb.group({
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
      if (this.marketingfieldValues.generatedText) {
        const generatedTextObj = this.parseGeneratedText(this.marketingfieldValues.generatedText);
        this.generatedText = {
          caption: generatedTextObj.caption || '',
          hashtag: generatedTextObj.hashtag || ''
        };
      }
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
    const allPlatforms = ['LinkedIn', 'Facebook', 'Twitter', 'Instagram'];
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
      if (this.generatedText.caption || this.generatedText.hashtag) {
        requestBody.fields['generatedText'] = {
          caption: this.generatedText.caption,
          hashtag: this.generatedText.hashtag
        };
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
    if (this.regenerateCount < 3) {
      this.regenerateCount++;
      this.hitGenerateCaptionAPI(prompt);
    }
  }

  generateImage(prompt: string): void {
    if (this.regenerateCount < 3) {
      this.regenerateCount++;
      // this.hitGenerateCaptionAPI(prompt);
      this.hitGenerateImageAPI(prompt);
    }
  }
  
  hitGenerateCaptionAPI(prompt: string): void {
    // this.generatedText = {
    //   caption: 'This is a static generated caption.',
    //   hashtag: '#StaticHashtag'
    // };
    // return
    this.isLoading = true;
    const formData = new FormData();
    formData.append('prompt', prompt);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`
    });
  
    // this.rest_api.generateCaptionAPI(prompt).subscribe({
    this.http.post('http://10.11.0.67:5006/generate-caption', formData, { headers }).subscribe({
      next: (response: any) => {
        console.log('Caption Response:', response);
        this.generatedText = {
          caption: this.cleanUpString(response.caption),
          hashtag: this.cleanUpString(response.hashtag)
        };
        this.isLoading = false;
        this.isGenerated = true;
      },
      error: (error) => {
        console.error('Error generating text:', error);
        this.toastService.showError('Error generating text')
      }
    });
  }
  
  hitGenerateImageAPI(prompt: string): void {
    // this.generatedImageUrl = 'https://via.placeholder.com/150';
    // return
    this.isLoading = true;
    const formData = new FormData();
    formData.append('prompt', prompt);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`
    });

    // this.rest_api.generateImageAPI(prompt).subscribe({
    this.http.post('http://10.11.0.67:5006/generate-image', formData, { headers }).subscribe({
      next: (response: any) => {
        console.log('Image Response:', response);
        if (response.image) {
          this.generatedImageUrl = 'data:image/png;base64,' + response.image;
          this.isLoading = false;
          this.isGenerated = true;
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
}
