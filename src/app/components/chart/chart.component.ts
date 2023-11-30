import { Component, ViewChild, Input, OnChanges, SimpleChanges } from "@angular/core";
import { DataChart } from 'src/app/models/dataChart';

import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexTooltip,
    ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
};

@Component({
    selector: "div-chart",
    templateUrl: "./chart.component.html",
    styleUrls: ["./chart.component.scss"]
})
export class DivChartComponent implements OnChanges {
    @Input() inputDatachart = {};
    dataChart: DataChart;
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions> | any;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['inputDatachart']) {
            this.dataChart = changes['inputDatachart'].currentValue;
            console.log(this.dataChart);
        }

        this.chartOptions = {
            series: [
                {
                    name: this.dataChart.name,
                    data: this.dataChart.numbers
                }
            ],
            chart: {
                height: 350,
                type: "area",
                toolbar: {
                    show: false,
                }
            },
            dataLabels: {
                enabled: true
            },
            stroke: {
                curve: "smooth"
            },
            xaxis: {
                type: "datetime",
                categories: this.dataChart.dates
            },
            tooltip: {
                theme: 'dark',
                x: {
                    format: "dd/MM/yyyy"
                }
            }
        };
    }
}