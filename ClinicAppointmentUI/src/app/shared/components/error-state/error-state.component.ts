import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  imports: [MatIconModule],
  templateUrl: './error-state.component.html',
})
export class ErrorStateComponent {
  readonly message = input('The appointments could not be loaded.');
}
