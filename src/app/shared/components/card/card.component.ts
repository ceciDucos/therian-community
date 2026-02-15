
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  title = input('');
  description = input('');
  footer = input(false);
  header = input(false);
  className = input('');

  classes = computed(() => `card ${this.className()}`);
}
