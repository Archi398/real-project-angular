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
import { ChartService } from 'src/app/services/chart.service';

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


    collectionDataChart: any[] = [];

    public chartOptions: Partial<ChartOptions> | any;

    constructor(private cts: ChartService) {
        
    }



    ngOnChanges(changes: SimpleChanges) {
        if (changes['inputCollectionData']) {
            this.collectionDataChart = changes['inputCollectionData'].currentValue || [];
            if (this.collectionDataChart.length > 0) {
                this.collectionDataChart.forEach((chart: any[], index) => {
                    let arraySeries: any[] = [];
                    let arrayDates: any[] = [];
                    chart.forEach((element: any) => {
                        arraySeries.push(
                            {
                                name: element.name,
                                data: element.numbers
                            }
                        )
                        arrayDates = element.dates;
                    })

                    this.initChartOptions(index, arraySeries, arrayDates);
                });
            }
        }

    }

    initChartOptions(index: number, series: any[], dates: any[]) {
        let chartOptions = {
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

        this.collectionDataChart[index].chartOptions = chartOptions;
    }
}