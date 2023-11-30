import { Component, OnChanges, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { ChartService } from 'src/app/services/chart.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DataChart } from 'src/app/models/dataChart';

interface FormDate {
  [key: string]: Date | any;
}

@Component({
  selector: 'form-chart',
  templateUrl: './form-chart.component.html',
  styleUrls: ['./form-chart.component.scss'],
})
export class FormChartComponent implements OnChanges {
  numberList: number[] = [10, 20, 30, 40, 50, 60];
  myForm: FormGroup;
  listItem = [1];

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private auth: AuthService,
    private breakpointObserver: BreakpointObserver,
    private cts: ChartService
  ) {

    this.myForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      number_1: new FormControl('', [
        Validators.required,
      ]),
      date_1: new FormControl('', [
        Validators.required,
      ]),
    });
  }
  ngOnChanges(changes: SimpleChanges) {

  }


  onSubmit() {
    let data: DataChart = {
      name: "",
      numbers: [],
      dates: [],
    };;

    data.name = this.myForm.value.name;

    const formDate = this.myForm.value as FormDate;
    for (const [key, value] of Object.entries(formDate)) {
      if (key.includes('date')) {
        data.dates.push(value.toISOString());
      }
    }

    for (const [key, value] of Object.entries(this.myForm.value)) {
      if (key.includes('number')) {
        data.numbers.push(value);
      }
    }

    this.cts.addChart(data);
  }

  addValue() {
    this.fb.group(this.myForm);

    let plusone = this.listItem[this.listItem.length - 1] + 1;
    this.listItem.push(plusone)

    this.myForm.addControl(
      `date_${this.listItem[this.listItem.length - 1]}`, new FormControl('', [
        Validators.required
      ]),
    )
    this.myForm.addControl(
      `number_${this.listItem[this.listItem.length - 1]}`, new FormControl('', [
        Validators.required
      ]),
    )

    //this.myForm.removeControl(`date_${event.source.value}`)

  }

}