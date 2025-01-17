import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
  bees: string = '';

  ngOnInit(): void {
    this.bees = '🐝'.repeat(100000);
  }
}
