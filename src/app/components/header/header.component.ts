import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { ThemeService, Theme } from 'src/app/services/theme.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentTheme: Theme = Theme.LIGHT;
  currentThemeIcon = 'icon-moon';
  user: User | null = null;
  username: string = '';
  condition: Boolean;

  @Input()
  pageTitle = '';

  constructor(
    private renderer: Renderer2,
    private themeService: ThemeService,
    private auth: AuthService,
    private router: Router,
    public uds: UserDataService,
  ) { }

  ngOnInit(): void {
    
    this.auth.user$.subscribe((user: User | null) => {
      this.user = user;
    });

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(event => {
        this.condition = event.url === "/user" ? true : false;
      });

  }



  logout() {
    this.auth.signout();
  }

  userSettings() {
    this.router.navigateByUrl('/user');
  }

  home() {
    this.router.navigateByUrl('/');
  }

}