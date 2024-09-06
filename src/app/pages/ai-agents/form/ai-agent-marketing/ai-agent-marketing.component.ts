import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiAgentFormComponent } from '../../ai-agent-form/ai-agent-form.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  @ViewChild('agentSave') agentSave: AiAgentFormComponent;

  marketingForm: FormGroup;
  selectedPlatforms: Platform[] = [];
  generatedImageUrl: string | null = null;
  // generatedText: string | null = null;
  generatedText: { caption: string; hashtag: string } = {
    caption: '',
    hashtag: ''
  };
  isGenerated: boolean = false;
  regenerateCount: number = 0;
  isAccepted: boolean = false;

  platforms: Platform[] = [
    { name: 'Facebook', icon: 'fab fa-facebook' },
    { name: 'Instagram', icon: 'fab fa-instagram' },
    // { name: 'Twitter', icon: 'fab fa-twitter' },
    // { name: 'LinkedIn', icon: 'fab fa-linkedin' }
  ];
  private apiToken = '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';
  constructor(private fb: FormBuilder,private http: HttpClient) {
    this.marketingForm = this.fb.group({
      linkedInPageId: [''],
      linkedInToken: [''],
      facebookPageId: [''],
      facebookToken: [''],
      twitterPageId: [''],
      twitterToken: [''],
      instagramPageId: [''],
      instagramToken: [''],
      promptType: ['image', Validators.required],
      promptDescription: ['', Validators.required],
      imagePrompt: [''],
      textPrompt: ['']
    });
  }

  ngOnInit(): void {
    // this.platforms.forEach(platform => {
    //   this.marketingForm.get('platforms')?.get(platform.name)?.valueChanges.subscribe(selected => {
    //     this.togglePlatformFields();
    //   });
    // });
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
        pageIdControl?.setValue('');
        tokenControl?.setValue('');
      }
      
      pageIdControl?.updateValueAndValidity();
      tokenControl?.updateValueAndValidity();
    });
    
  }
  isPlatformSelected(platformName: string): boolean {
    return this.selectedPlatforms.some(p => p.name === platformName);
  }
  onSubmit(): void {
    if (this.marketingForm.valid) {
      const promptType = this.marketingForm.get('promptType').value;
      if (promptType === 'image') {
        this.generateImage();
      } else {
        this.generateText();
      }
      this.isGenerated = true;
    } else {
      console.error('Form is invalid');
    }
  }
  
  // onSubmit(): void {
  //   if (this.marketingForm.valid) {
  //     this.generateImage();
  //     const formValue = this.marketingForm.value;
  //     const req_body: any = {
  //       platforms: {},
  //       promptType: formValue.promptType,
  //       promptDescription: formValue.promptDescription
  //     };

  //     // Add only selected platforms to the request body
  //     this.selectedPlatforms.forEach(platform => {
  //       const name = platform.name.toLowerCase();
  //       req_body.platforms[platform.name] = true;
  //       req_body[`${name}PageId`] = formValue[`${name}PageId`];
  //       req_body[`${name}Token`] = formValue[`${name}Token`];
  //     });
  //     console.log("MarketingForm", req_body);
  //     const botName = "this.params.agentId"; // You might want to replace this with actual dynamic value
  //     const type = "create";
  //     // this.agentSave.saveBot(req_body, botName, type);
  //   } else {
  //     console.error('Form is invalid');
  //   }
  // }
  generateText(): void {
    // Simulating text generation
    // setTimeout(() => {
    //   this.generatedText = "This is a sample generated text for your marketing campaign. It showcases the power of AI in creating engaging content for various social media platforms.";
    //   // Replace with actual text generation logic
    // }, 1000);
    if (this.regenerateCount < 3) {
      this.regenerateCount++;
      this.hitGenerateCaptionAPI();
    }

  }
  generateImage(): void {
    if (this.regenerateCount < 3) {
      this.regenerateCount++;
      this.hitGenerateCaptionAPI();
    }
  }

  
  regenerateImage(): void {
    if (this.regenerateCount < 3) {
      this.regenerateCount++;
      this.generateImage();
      this.hitGenerateCaptionAPI();
    }
  }
  hitGenerateCaptionAPI(): void {
    if (this.regenerateCount < 3) {
      this.regenerateCount++;
  
      const formData = new FormData();
      formData.append('prompt', 'A dog'); // Replace with dynamic prompt if needed
  
      const headers = new HttpHeaders({
        'Authorization': 'Bearer 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',
      });
  
      this.http.post('http://10.11.0.67:5006/generate-caption', formData, { headers }).subscribe({
          next: (response: any) => {
            console.log('Response received:', response);
            // Correctly format caption and hashtag without removing emojis or symbols
            const caption = this.cleanUpString(response.caption);
            const hashtag = this.cleanUpString(response.hashtag);
  
            console.log('Caption:', caption);
            console.log('Hashtag:', hashtag);
            // this.generatedText += `${caption} ${hashtag}`;
            this.generatedText = {
              caption: response.caption,
              hashtag: response.hashtag
            };
            
            // Call the next step after processing the response
            this.generateImage();
          },
          error: (error) => {
            console.error('Error generating image:', error);
          }
        });
    }
  }
  
  // Helper function to clean up unnecessary escaped characters without removing emojis
  cleanUpString(str: string): string {
    return str
      .replace(/\\"/g, '"')       // Removes escaped quotes
      .replace(/^"(.*)"$/, '$1')  // Removes starting and ending quotes if they exist
      .replace(/\\u([\dA-F]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16))); // Decodes Unicode for emojis
  }
  acceptGenerated(): void {
    console.log('Content accepted:', this.generatedImageUrl || this.generatedText);
    this.isGenerated = false;
    // Here you might want to save the generated content or trigger further processing
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
  // clearForm(): void {
  //   this.marketingForm.reset({
  //     promptType: 'image'
  //   });
  //   this.selectedPlatforms = [];
  // }

  toggleAccepted(): void {
    this.isAccepted = !this.isAccepted;
  }
  
  regenerateContent(): void {
    if (this.marketingForm.get('promptType').value === 'image') {
      this.regenerateImage();
    } else {
      this.generateText();
    }
  }
}
