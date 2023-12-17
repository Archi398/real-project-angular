import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
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

addChart(datachart: any): Promise<any> | undefined {
    if (datachart && this.user) {
      return this.chartCollection.add({
        name: datachart.name,
        numbers: datachart.numbers,
        dates: datachart.dates,
        userId: this.user.uid
      });
    }else{
      return;
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

  getChartsByUserId(id: string): Observable<any[]> {
    return new Observable((observer) => {
      this.chartCollection.ref
        .where('userId', '==', id)
        .get()
        .then((querySnapshot: QuerySnapshot<any>) => {
          const result = querySnapshot.docs.map((doc) => doc.data());
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
        });
    });

  }
 deleteSeries(seriesId: string): Observable<void> {
    return new Observable((observer) => {
      this.chartCollection.doc(seriesId).delete()
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

}
