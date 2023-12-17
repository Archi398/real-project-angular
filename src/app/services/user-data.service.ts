import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, from, EMPTY } from 'rxjs';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import { UserData } from 'src/app/models/userData';
import { User } from 'src/app/models/user';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userDataCollection: AngularFirestoreCollection;
  currentUser: Observable<User | undefined>;
  username: string = "";
  friends: any[] = [];
  arrayIdFriends: string[] = [];


  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
  ) {
    this.userDataCollection = this.afs.collection<any>('userData');

    this.currentUser = this.auth.getUserObservable();

    this.updateFriendsList();

    this.getUsernameCurrentUser().subscribe(result => {
      this.username = result;
    });


  }

  updateFriendsList(){
    this.friends = [];
    this.getFriendsCurrentUser().subscribe(result => {
      this.arrayIdFriends = result;
      result.forEach(element => {
        this.getUserDataByUserId(element).subscribe(result => {
          this.friends.push(result[0]);
        });;
      })
    });;
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

  getUserDataByUserId(value: string): Observable<any[]> {
    return new Observable((observer) => {
      this.userDataCollection.ref
        .where('userId', '==', value)
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
    return this.currentUser.pipe(
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

  async getUsernameById(userId: string): Promise<string> {
    try {
      const querySnapshot = await from(
        this.userDataCollection.ref
          .where('userId', '==', userId)
          .get()
      ).toPromise();
  
      if (querySnapshot) {
        const result = querySnapshot.docs.map((doc) => doc.data() as UserData);
        return result.length > 0 ? result[0].username : '';  
      }else{
        return '';
      }
    } catch (error) {
      console.error('Error:', error);
      return ''; // Return a default value or handle the error accordingly
    }
  }

  getFriendsCurrentUser(): Observable<any[]> {
    return this.currentUser.pipe(
      filter(user => !!user),
      switchMap(user =>
        this.userDataCollection.ref
          .where('userId', '==', user?.uid)
          .get()
      ),
      map((querySnapshot: QuerySnapshot<any>) => {
        const result = querySnapshot.docs.map((doc) => doc.data() as UserData);
        return result.length > 0 ? result[0].friends : [];
      })
    );
  }

  updateUsernameCurrentUser(value: string) {
    return this.currentUser.pipe(
      filter(user => !!user),
      switchMap(user =>
        this.userDataCollection.ref
          .where('userId', '==', user?.uid)
          .get()
      ),
      switchMap((querySnapshot: QuerySnapshot<any>) => {
        const doc = querySnapshot.docs[0];
        if (doc) {
          this.username = value;
          return from(doc.ref.update({ username: value }));
        } else {
          return EMPTY;
        }
      })
    );
  }

  addFriends(value: string) {
    return this.currentUser.pipe(
      filter(user => !!user),
      switchMap(user =>
        this.userDataCollection.ref
          .where('userId', '==', user?.uid)
          .get()
      ),
      switchMap((querySnapshot: QuerySnapshot<any>) => {
        const doc = querySnapshot.docs[0];
        if (doc) {
          const currentFriends = doc.data()?.['friends'] || []
          const updateFriends = [...currentFriends, value]

          return from(doc.ref.update({ friends: updateFriends }));
        } else {
          return EMPTY;
        }
      })
    );
  }



}
