import { Component, ViewChild, Input, OnChanges, SimpleChanges } from "@angular/core";

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
    @Input() inputCollectionData: any[];
    @ViewChild("chart") chart: ChartComponent;

    collectionDataChart = [];

    public chartOptions: Partial<ChartOptions> | any;

    constructor() {
    }



    ngOnChanges(changes: SimpleChanges) {
        if (changes['inputCollectionData']) {
            this.collectionDataChart = changes['inputCollectionData'].currentValue || [];
        }

        if (this.collectionDataChart.length > 0) {
            let arraySeries: any[] = [];
            let arrayDates: any[] = [];

            this.collectionDataChart.forEach((element: any) => {
                arraySeries.push(
                    {
                        name: element.name,
                        data: element.numbers
                    }
                )
                arrayDates = element.dates;
            })

            this.initChartOptions(arraySeries, arrayDates);
        }
    }

    initChartOptions(series: any[], dates: any[]) {
        this.chartOptions = {
            series: series,
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
                categories: dates
            },
            tooltip: {
                theme: 'dark',
                x: {
                    format: "dd/MM/yyyy"
                }
            },
            legend: {
                show: true
            }
        };
    }
}
