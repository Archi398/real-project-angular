import { Component } from '@angular/core';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  currentUsername = "test pour l'instant";

  constructor(
    
  ) {

  }

  // getCollectionData(): void {
  //   this.cts.getChartsCurrentUser().subscribe((data) => {
  //     this.collectionData = data;
  //   });
  // }

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