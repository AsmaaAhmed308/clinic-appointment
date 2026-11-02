import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-available-slots',
  imports: [MatButtonModule],
  templateUrl: './available-slots.component.html',
})
export class AvailableSlotsComponent {
  readonly doctorSelected = input(false);
  readonly dateSelected = input(false);
  readonly loading = input(false);
  readonly slots = input<string[]>([]);
  readonly selectedSlotChange = output<string | null>();
  readonly selectedSlot = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.doctorSelected();
      this.dateSelected();
      this.slots();
      this.loading();
      untracked(() => this.clearSelection());
    });
  }

  selectSlot(slot: string): void {
    this.selectedSlot.set(slot);
    this.selectedSlotChange.emit(slot);
  }

  displayTime(slot: string): string {
    return slot.length >= 5 ? slot.slice(0, 5) : slot;
  }

  private clearSelection(): void {
    if (this.selectedSlot() === null) {
      return;
    }

    this.selectedSlot.set(null);
    this.selectedSlotChange.emit(null);
  }
}
