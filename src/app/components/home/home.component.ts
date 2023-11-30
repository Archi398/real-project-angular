import { Component } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
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
    private cts: ChartService
  ) {
    cts.getChartsCurrentUser();
    this.getCollectionData();
  }

  getCollectionData(): void {
    this.cts.getChartsCurrentUser().subscribe((data) => {
      this.collectionData = data;
    });
  }

  // setAsNotCompleted(todo: Todo) {
  //   const todoDoc = this.firestore.doc(`todos/${todo.id}`);
  //   todoDoc.update({
  //     isCompleted: false
  //   });
  // }

  // deleteTodo(todo: Todo) {
  //   const todoDoc = this.firestore.doc(`todos/${todo.id}`);
  //   todoDoc.delete();
  // }

}
