import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { UserData } from 'src/app/models/userData';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userDataCollection: AngularFirestoreCollection;
  test: string = '';

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
  ) {
    this.userDataCollection = this.afs.collection<any>('userData');
  }

  getUserDataByUsername(value: string): Observable<any[]> {
    return new Observable((observer) => {
      this.userDataCollection.ref
        .where('username', '==', value)
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


  getUsernameCurrentUser(): Observable<string> {
    return this.auth.getUserObservable().pipe(
      filter(user => !!user),
      switchMap(user =>
        this.userDataCollection.ref
          .where('userId', '==', user?.uid)
          .get()
      ),
      map((querySnapshot: QuerySnapshot<any>) => {
        const result = querySnapshot.docs.map((doc) => doc.data() as UserData);
        return result.length > 0 ? result[0].username : '';
      })
    );
  }


}
