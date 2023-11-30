import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { DataChart } from '../models/dataChart';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private chartCollection: AngularFirestoreCollection;
  user: User | null = null;
  dataChart: DataChart | null = null;


  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.auth.user$.subscribe((user: User | null) => {
      if (user) {
        this.user = user;
      }
    });

    this.chartCollection = afs.collection('charts');
  }

  addChart(datachart: any) {
    if (datachart && this.user) {
      this.chartCollection.add({
        name: datachart.name,
        numbers: datachart.numbers,
        dates: datachart.dates,
        userId: this.user.uid
      });
    }
  }

  getChartsCurrentUser(): Observable<any[]> {
    return from(this.chartCollection.ref.where('userId', '==', this.user?.uid).get()).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
      })
    );
  }

}
