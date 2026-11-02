import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly title = input('Nothing to show');
  readonly message = input('');
}
