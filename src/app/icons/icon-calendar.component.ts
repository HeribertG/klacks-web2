import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-icon-calendar',
	styleUrls: ['./buttons.scss'],
	template: `
  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="24" width="24"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
	<g>
		<path   fill="var(--iconBlackColor)" d="M460.8,51.2h-25.6V25.6c0-15.36-10.24-25.6-25.6-25.6C394.24,0,384,10.24,384,25.6v25.6H128V25.6
			C128,10.24,117.76,0,102.4,0C87.04,0,76.8,10.24,76.8,25.6v25.6H25.6C12.8,51.2,0,61.44,0,76.8v358.4c0,15.36,12.8,25.6,25.6,25.6
			h156.16c-17.92-30.72-28.16-66.56-28.16-102.4c0-112.64,92.16-204.8,204.8-204.8c48.64,0,92.16,17.92,128,46.08V76.8
			C486.4,64,473.6,51.2,460.8,51.2z"/>
	</g>
</g>
<g>
	<g>
		<path   fill="var(--iconBlackColor)" opacity="0.3" d="M358.4,204.8c-84.48,0-153.6,69.12-153.6,153.6S273.92,512,358.4,512S512,442.88,512,358.4S442.88,204.8,358.4,204.8z
			 M409.6,384h-51.2c-15.36,0-25.6-10.24-25.6-25.6v-76.8c0-15.36,10.24-25.6,25.6-25.6c15.36,0,25.6,10.24,25.6,25.6v51.2h25.6
			c15.36,0,25.6,10.24,25.6,25.6C435.2,373.76,424.96,384,409.6,384z"/>
	</g>
</g>

</svg>
`
})
export class IconCalendarComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {
	}

}
