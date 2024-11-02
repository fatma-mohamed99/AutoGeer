import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { FooterComponent } from "./footer/footer.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { AuthGuard } from '../../auth.guard';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, LoginComponent, RegistrationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { 
  title=''; 
  isLoginModalOpen = false;
  isRegistrationModalOpen = false;

  openLoginModal() {
    this.isLoginModalOpen = true;
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
  }

  openRegistrationModal() {
    this.isRegistrationModalOpen = true;
  }

  closeRegistrationModal() {
    this.isRegistrationModalOpen = false;
  }

  get isModalOpen() {
    return this.isLoginModalOpen || this.isRegistrationModalOpen;
  }
}

