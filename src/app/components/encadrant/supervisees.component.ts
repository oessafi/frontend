import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supervisees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supervisees.component.html',
  styleUrls: ['./supervisees.component.css']
})
export class SuperviseesComponent {
  title = 'Mes doctorants';
}
