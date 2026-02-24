import { Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { Aside } from "../../components/aside/aside";

@Component({
  selector: 'app-dashboard',
  imports: [Header, Aside],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
