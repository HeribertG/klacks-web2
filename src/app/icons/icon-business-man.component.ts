import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-business-man',
  styleUrls: ['./buttons.scss'],
  template: `
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  height="24" width="24"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
	<g>
		<path fill="var(--iconBlackColor)" d="M433.425,317.697c-33.422-33.422-74.616-56.236-119.502-66.794l-29.238,29.238l12.813,155.138
			c0.434,5.263-0.999,10.51-4.05,14.821l-29.235,41.31c-1.887,2.666-4.949,4.25-8.214,4.25s-6.327-1.584-8.214-4.25l-29.235-41.31
			c-3.05-4.311-4.484-9.559-4.05-14.821l12.813-155.138l-29.238-29.238c-44.886,10.558-86.081,33.372-119.502,66.794
			C31.182,365.089,5.082,428.1,5.082,495.122c0,9.321,7.557,16.878,16.878,16.878h468.08c9.321,0,16.878-7.557,16.878-16.878
			C506.918,428.1,480.817,365.089,433.425,317.697z"/>
	</g>
</g>
<g>
	<g>
		<circle fill="var(--iconBlackColor)" opacity="0.3"  cx="256.003" cy="111.54" r="111.54"/>
	</g>
</g>

</svg>
`
})
export class IconBusinessManComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
