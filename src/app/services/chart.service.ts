import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { DataChart } from '../models/dataChart';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';


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
  ) {
    this.auth.user$.subscribe((user: User | null) => {
      if (user) {
        this.user = user;
      }
    });

    this.chartCollection = this.afs.collection('charts');
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
    return this.auth.getUserObservable().pipe(
      filter(user => !!user),
      switchMap(user =>
        this.chartCollection.ref.where(
          'userId', '==', user?.uid
        ).get()
      ),
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
