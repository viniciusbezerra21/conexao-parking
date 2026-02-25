import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Aside } from "../aside/aside";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-layout',
  imports: [Header, Aside, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
