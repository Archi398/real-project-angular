import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * @title Determinate progress-bar
 */
@Component({
  selector: 'progress-todo',
  templateUrl: 'progress-todo.component.html',
  standalone: true,
  styleUrls: ['progress-todo.component.scss'],
  imports: [MatProgressBarModule],
})
export class ProgressBarTodo implements OnChanges {
  @Input() inputProgressValue = 0;
  value = 0;

  constructor() {
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputProgressValue']) {
      this.value = Math.round(changes['inputProgressValue'].currentValue);
    }
  }
}
