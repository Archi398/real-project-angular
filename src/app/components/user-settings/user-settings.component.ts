import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  currentUsername = "test pour l'instant";
  searchQuery: string = '';
  items$: Observable<any[]>;

  constructor(
    private afs: AngularFirestore,
    private uds: UserDataService
  ) {
    this.items$ = uds.getUserDataByUsername(this.searchQuery);
  }

  search(value: string) {
    this.items$ = this.uds.getUserDataByUsername(value);
  }

}