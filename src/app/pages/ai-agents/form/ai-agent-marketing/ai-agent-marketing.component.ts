import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiAgentFormComponent } from '../../ai-agent-form/ai-agent-form.component';
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
  generatedText: string | null = null;
  isGenerated: boolean = false;
  regenerateCount: number = 0;
  isAccepted: boolean = false;

  platforms: Platform[] = [
    { name: 'Facebook', icon: 'fab fa-facebook' },
    { name: 'Instagram', icon: 'fab fa-instagram' },
    // { name: 'Twitter', icon: 'fab fa-twitter' },
    // { name: 'LinkedIn', icon: 'fab fa-linkedin' }
  ];

  constructor(private fb: FormBuilder) {
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
    setTimeout(() => {
      this.generatedText = "This is a sample generated text for your marketing campaign. It showcases the power of AI in creating engaging content for various social media platforms.";
      // Replace with actual text generation logic
    }, 1000);
  }
  generateImage(): void {
    // This is where you would call your image generation service
    // For now, we'll just simulate it with a timeout
    setTimeout(() => {
      this.generatedImageUrl = '../../../../../assets/images/agent/Marketing Image.svg';
      // You should replace this with the actual URL of the generated image
    }, 2000); // Simulating a 2-second delay for image generation
  }

  
  regenerateImage(): void {
    if (this.regenerateCount < 3) {
      this.regenerateCount++;
      this.generateImage();
    }
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
