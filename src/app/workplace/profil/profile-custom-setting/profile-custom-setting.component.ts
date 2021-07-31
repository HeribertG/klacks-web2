import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-custom-setting',
  templateUrl: './profile-custom-setting.component.html',
  styleUrls: ['./profile-custom-setting.component.scss']
})
export class ProfileCustomSettingComponent implements OnInit {

  isChecked = false;

  constructor() { }

  ngOnInit(): void {
    this.setTheme();
  }

  onDarkmodeChecked(): void {
    if (this.isChecked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  setTheme(): void {

    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme === 'dark') {
      this.isChecked = true;

    }
  }
}
