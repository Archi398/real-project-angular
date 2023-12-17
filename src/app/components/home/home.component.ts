import { Component } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: User | null = null;
  collectionData: any[];

  constructor(
    private cts: ChartService,
    public uds: UserDataService
  ) {
    cts.getChartsCurrentUser();
    this.getCollectionData();
  }

  getCollectionData(): void {
    this.cts.getChartsCurrentUser().subscribe((data) => {
      if (data.length > 0) {
        data[0].username = "moi";
        this.collectionData = [];
        this.collectionData = [...this.collectionData, data];
        this.uds.arrayIdFriends.forEach(element => {
          this.cts.getChartsByUserId(element).subscribe(async (data2) => {
            if (data2.length > 0) {
              const username = await this.uds.getUsernameById(data2[0].userId);
              data2[0].username = username;
              this.collectionData = [...this.collectionData, data2];
            }
          })
        })
      }
    });
  }
}
