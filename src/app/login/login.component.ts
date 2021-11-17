import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'particles.js/particles';
import * as particlesJS from 'particlesjs';

declare var particlesJS :any;
import { RestApiService } from '../pages/services/rest-api.service';
import { AuthenticationService } from '../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  password:any;
  userName:any;

  constructor(private router:Router,private rest:RestApiService, private authService:AuthenticationService) { }

  ngOnInit() {
    // this.getParticles();
    // particlesJS("particles-js", {
    //   "particles": {
    //     "number": {
    //       "value": 200,
    //       "density": {
    //         "enable": true,
    //         "value_area": 650
    //       }
    //     },
    //     "color": {
    //       "value": "#d3dbd4"
    //     },
    //     "shape": {
    //       "type": "circle",
    //       "stroke": {
    //         "width": 1,
    //         "color": "#d3dbd4"
    //       },
    //       "polygon": {
    //         "nb_sides": 5
    //       },

    //     },
    //     "opacity": {
    //         "value": 1,
    //         "random": false,
    //         "anim": {
    //         "enable": false,
    //         "speed": 1,
    //         "opacity_min": 0.1,
    //         "sync": false
    //       }
    //     },
    //     "size": {
    //         "value": 7,
    //         "random": true,
    //         "anim": {
    //         "enable": false,
    //         "speed": 40,
    //         "size_min": 0.3,
    //         "sync": false
    //       }
    //     },
    //     "line_linked": {
    //       "enable": true,
    //       "distance": 150,
    //       "color": "#d3dbd4",
    //       "opacity": 0.6,
    //       "width": 1
    //     },
    //     "move": {
    //       "enable": true,
    //       "speed": 6,
    //       "direction": "none",
    //       "random": false,
    //       "straight": false,
    //       "out_mode": "out",
    //       "bounce": false,
    //       "attract": {
    //         "enable": false,
    //         "rotateX": 600,
    //         "rotateY": 600
    //       }
    //     }
    //   },
    //   "interactivity": {
    //     "detect_on": "canvas",
    //     "events": {
    //       "onhover": {
    //         "enable": true,
    //         "mode": "grab"
    //       },
    //     },
    //     "modes": {
    //       "grab": {
    //         "distance": 120,
    //         "line_linked": {
    //           "opacity": 1
    //         }
    //       },
    //       "bubble": {
    //         "distance": 400,
    //         "size": 80,
    //         "duration": 2,
    //         "opacity": 8,
    //         "speed": 3
    //       },
    //       "repulse": {
    //         "distance": 200,
    //         "duration": 0.4
    //       },
    //       "push": {
    //         "particles_nb": 4
    //       },
    //       "remove": {
    //         "particles_nb": 2
    //       }
    //     }
    //   },
    //   "retina_detect": true
    // });
    this.authService.logout();
  }

  getAccessToken(){
    this.rest.getAccessToken().subscribe(res =>{
      localStorage.setItem("accessToken", res['accessToken']);
      localStorage.setItem('authKey', 'V2t6Q2Q3N01Gb1dDR252TXJ0TzJiT0pEaHR3a1ZXNFVBdjlIRVprVG9Vaz0=');
      this.router.navigateByUrl("pages/dashboard")
    });
  }
}
