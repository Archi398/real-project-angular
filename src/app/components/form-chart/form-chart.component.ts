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
  myForm: FormGroup;
  listItem = [1, 2, 3, 4];
  dataSeries: any[] = [];

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private auth: AuthService,
    private breakpointObserver: BreakpointObserver,
    private cts: ChartService
  ) {
    this.getAllSeries();

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
      number_2: new FormControl('', [
        Validators.required,
      ]),
      date_2: new FormControl('', [
        Validators.required,
      ]),
      number_3: new FormControl('', [
        Validators.required,
      ]),
      date_3: new FormControl('', [
        Validators.required,
      ]),
      number_4: new FormControl('', [
        Validators.required,
      ]),
      date_4: new FormControl('', [
        Validators.required,
      ]),
    });
  }
  ngOnChanges(changes: SimpleChanges) {

  }


  async onSubmit() {
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

    await this.cts.addChart(data);


    this.myForm.reset();
    Object.keys(this.myForm.controls).forEach(key =>{
      this.myForm.controls[key].setErrors(null)
    });
   window.location.reload();
  }

  getAllSeries() {
    this.cts.getChartsCurrentUser().subscribe((data) => {
        this.dataSeries = data;
    });
}

deleteSelectedSeries() {
    const selectedSeries = this.dataSeries.filter((series) => series.selected);
    selectedSeries.forEach((series) => {
        this.cts.deleteSeries(series.id).subscribe(() => {
            this.dataSeries = this.dataSeries.filter((s) => s.id !== series.id);
        });
    });
}

}