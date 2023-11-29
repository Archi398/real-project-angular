import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularFirestore, QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/app/models/user';
import { map, BehaviorSubject, combineLatest } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { BreakpointObserver } from '@angular/cdk/layout';


@Component({
  selector: 'form-chart',
  templateUrl: './form-chart.component.html',
  styleUrls: ['./form-chart.component.scss'],
})
export class FormChartComponent implements OnChanges {
  datachart = {};

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {

  }

  ngOnChanges(changes: SimpleChanges) {

  }


}
