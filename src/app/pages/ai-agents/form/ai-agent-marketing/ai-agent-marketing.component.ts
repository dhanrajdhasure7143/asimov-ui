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
      promptType: ['image'],
      promptDescription: [''],
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

  // Temporarly commented Starts
  // onSubmit(): void {
  //   if (this.marketingForm.valid) {
  //     const promptType = this.marketingForm.get('promptType').value;
  //     if (promptType === 'image') {
  //       this.generateImage();
  //     } else {
  //       this.generateText();
  //     }
  //     this.isGenerated = true;
  //   } else {
  //     console.error('Form is invalid');
  //   }
  // }

  // onSubmit(): void {
  //   if (this.marketingForm.valid) {
  //     const promptType = this.marketingForm.get('promptType')?.value;

  //     if (promptType === 'image') {
  //       this.generateImage();
  //     } else if (promptType === 'text') {
  //       this.generateText();
  //     }

  //     this.isGenerated = true;
  //   } else {
  //     console.error('Form is invalid');
  //   }
  // }

  // generateText(): void {
  //   if (this.regenerateCount < 3) {
  //     this.regenerateCount++;
  //     this.hitGenerateCaptionAPI();
  //   }

  // }
  // generateImage(): void {
  //   if (this.regenerateCount < 3) {
  //     this.regenerateCount++;
  //     this.hitGenerateCaptionAPI();
  //   }
  // }

  
  // regenerateImage(): void {
  //   if (this.regenerateCount < 3) {
  //     this.regenerateCount++;
  //     this.generateImage();
  //     this.hitGenerateCaptionAPI();
  //   }
  // }
  // hitGenerateCaptionAPI(): void {
  //   if (this.regenerateCount < 3) {
  //     this.regenerateCount++;
  //  // Get dynamic description from the form
  //  const promptDescription = this.marketingForm.get('promptDescription')?.value || 'A dog'; // Default to 'A dog' if empty
  //  const formData = new FormData();
  //  formData.append('prompt', promptDescription);
  //     const headers = new HttpHeaders({
  //       'Authorization': 'Bearer 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',
  //     });

  //     this.http.post('http://10.11.0.67:5006/generate-caption', formData, { headers }).subscribe({
  //         next: (response: any) => {
  //           console.log('Response received:', response);
  //           // Correctly format caption and hashtag without removing emojis or symbols
  //           const caption = this.cleanUpString(response.caption);
  //           const hashtag = this.cleanUpString(response.hashtag);
  
  //           console.log('Caption:', caption);
  //           console.log('Hashtag:', hashtag);
  //           // this.generatedText += `${caption} ${hashtag}`;
  //           this.generatedText = {
  //             caption: response.caption,
  //             hashtag: response.hashtag
  //           };
            
  //           // Call the next step after processing the response
  //           this.generateImage();
  //         },
  //         error: (error) => {
  //           console.error('Error generating image:', error);
  //         }
  //       });
  //   }
  // }
  // hitGenerateCaptionAPI(): void {
  //   const promptDescription = this.marketingForm.get('promptDescription')?.value || 'A dog'; // Default to 'A dog' if empty
  //   const formData = new FormData();
  //   formData.append('prompt', promptDescription);

  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.apiToken}`
  //   });

  //   this.http.post('http://10.11.0.67:5006/generate-caption', formData, { headers }).subscribe({
  //     next: (response: any) => {
  //       console.log('Caption Response:', response);
  //       const caption = this.cleanUpString(response.caption);
  //       const hashtag = this.cleanUpString(response.hashtag);

  //       this.generatedText = {
  //         caption,
  //         hashtag
  //       };
  //     },
  //     error: (error) => {
  //       console.error('Error generating text:', error);
  //     }
  //   });
  // }

  // Method to hit "generate-image" API
  // hitGenerateImageAPI(): void {
  //   const promptDescription = this.marketingForm.get('promptDescription')?.value || 'A dog'; // Default to 'A dog' if empty
  //   const formData = new FormData();
  //   formData.append('prompt', promptDescription);

  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.apiToken}`
  //   });

  //   this.http.post('http://10.11.0.67:5006/generate-image', formData, { headers }).subscribe({
  //     next: (response: any) => {
  //       console.log('Image Response:', response);
  //       this.generatedImageUrl = response.imageUrl; // Adjust according to response structure
  //     },
  //     error: (error) => {
  //       console.error('Error generating image:', error);
  //     }
  //   });
  // }
  // Helper function to clean up unnecessary escaped characters without removing emojis

   // regenerateContent(): void {
  //   if (this.marketingForm.get('promptType').value === 'image') {
  //     this.regenerateImage();
  //   } else {
  //     this.generateText();
  //   }
  // }
  // Temporarly commented Starts Ends

  cleanUpString(str: string): string {
    return str
      .replace(/\\"/g, '"')
      .replace(/^"(.*)"$/, '$1')
      .replace(/\\u([\dA-F]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
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

  toggleAccepted(): void {
    this.isAccepted = !this.isAccepted;
  }

  regenerateContent(): void {
    const promptType = this.marketingForm.get('promptType')?.value;
    const promptDescription = this.marketingForm.get('promptDescription')?.value || 'A dog';
  
    if (promptType === 'text') {
      this.generateText(promptDescription);
    } else if (promptType === 'image') {
      this.generateImage(promptDescription);
    }
  }

  onSubmit(): void {
    if (this.marketingForm.valid) {
      const promptType = this.marketingForm.get('promptType')?.value;
      const promptDescription = this.marketingForm.get('promptDescription')?.value || 'A dog';
  
      if (promptType === 'text') {
        this.generateText(promptDescription);
      } else if (promptType === 'image') {
        this.generateImage(promptDescription);
      }
  
      this.isGenerated = true;
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
    const formData = new FormData();
    formData.append('prompt', prompt);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`
    });
  
    this.http.post('http://10.11.0.67:5006/generate-caption', formData, { headers }).subscribe({
      next: (response: any) => {
        console.log('Caption Response:', response);
        this.generatedText = {
          caption: this.cleanUpString(response.caption),
          hashtag: this.cleanUpString(response.hashtag)
        };
      },
      error: (error) => {
        console.error('Error generating text:', error);
      }
    });
  }
  
  hitGenerateImageAPI(prompt: string): void {
    const formData = new FormData();
    formData.append('prompt', prompt);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`
    });
  
    this.http.post('http://10.11.0.67:5006/generate-image', formData, { headers }).subscribe({
      next: (response: any) => {
        console.log('Image Response:', response);
        if (response.image) {
          this.generatedImageUrl = 'data:image/png;base64,' + response.image;
        } else if (response.url) {
          this.generatedImageUrl = response.url;
        } else {
          console.error('Unexpected image response format');
        }
      },
      error: (error) => {
        console.error('Error generating image:', error);
      }
    });
  }
}
