import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularFirestore, QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/models/user';
import { map, BehaviorSubject, combineLatest } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { BreakpointObserver } from '@angular/cdk/layout';

enum FilterState {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed'
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnChanges {
  items$?: Observable<any[]>;
  filteredTodos$?: Observable<any[]>;
  totalActiveTodos = 0;
  user: User | null = null;
  FilterState = FilterState;
  activeFilter: BehaviorSubject<FilterState> = new BehaviorSubject<FilterState>(FilterState.ALL);
  isSmallScreen = false;
  progressValue = 0;

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.auth.user$.subscribe((user: User | null) => {
      if (user) {
        this.user = user;
        this.items$ = firestore.collection('todos', ref => ref.where('userId', '==', user.uid))
          .valueChanges({ idField: 'id' });
        this.items$
          .pipe(
            map((items: Todo[]) => items.filter(item => !item.isCompleted).length)
          )
          .subscribe((totalActiveTodos: number) => {
            this.totalActiveTodos = totalActiveTodos;
          });
        this.getTodos();
      }
    });
    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 375px)');

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');
    this.getTodos();
  }

  isFilterActive(filterState: FilterState) {
    return this.activeFilter.getValue() === filterState;
  }

  getTodos() {
    if (!this.items$) {
      return;
    }

    

    this.filteredTodos$ = combineLatest(this.items$, this.activeFilter).pipe(
      map(([todos, currentFilter]: [Todo[], FilterState]) => {
        let total = 0;
        let notCompleted = 0;
        this.progressValue = 0;

        todos.forEach(todo => {
          if(todo.isCompleted){
            notCompleted = notCompleted + 1;
          }
        })

        total = todos.length;
        this.progressValue = (notCompleted / total) * 100;

        if (currentFilter === FilterState.ALL) {
          return todos;
        }
        let todosfiltered = todos.filter((todo: Todo) => {
          const filterCondition = currentFilter === FilterState.COMPLETED ? true : false;
          return todo.isCompleted === filterCondition;
        });
        notCompleted = 0;
        this.progressValue = 0;
        todosfiltered.forEach(todo => {
          if(todo.isCompleted){
            notCompleted = notCompleted + 1;
          }
        })

        total = todosfiltered.length;
        this.progressValue = (notCompleted / total) * 100 || 0;
        return todosfiltered;
      })
    );
  }


  setFilterState(filterState: FilterState) {
    this.activeFilter.next(filterState);
  }

  clearCompleted() {
    if (this.user && this.items$) {
      this.firestore
        .collection<Todo>('todos', ref => ref
          .where('userId', '==', this.user?.uid)
          .where('isCompleted', '==', true)
        )
        .get()
        .pipe(
          map((qs: QuerySnapshot<Todo>) => {
            return qs.docs;
          })
        )
        .subscribe((docs: QueryDocumentSnapshot<Todo>[]) => {
          docs.forEach((doc: QueryDocumentSnapshot<Todo>) => {
            doc.ref.delete();
          });
        });
    }
  }

  setAsCompleted(todo: Todo) {
    const todoDoc = this.firestore.doc(`todos/${todo.id}`);
    todoDoc.update({
      isCompleted: true
    });
  }

  setAsNotCompleted(todo: Todo) {
    const todoDoc = this.firestore.doc(`todos/${todo.id}`);
    todoDoc.update({
      isCompleted: false
    });
  }

  deleteTodo(todo: Todo) {
    const todoDoc = this.firestore.doc(`todos/${todo.id}`);
    todoDoc.delete();
  }

}
