import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-spreadsheet',
  styleUrls: ['./buttons.scss'],
  template: `
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="24" width="24"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
	<rect x="34.5" y="49.708" fill="transparent"  width="272.111" height="273.063"/>
	<rect x="205.054" y="186.235" fill="transparent" width="272.111" height="273.063"/>
</g>
<path fill="var(--iconBlackColor)" d="M314.074,9.884H27.039C12.105,9.884,0,21.99,0,36.924v298.631c0,14.933,12.105,27.039,27.039,27.039
	h287.034c14.933,0,27.039-12.106,27.039-27.039V36.924C341.113,21.99,329.006,9.884,314.074,9.884z M54.078,167.545h89.439v37.388
	H54.078V167.545z M287.034,113.467h-89.438V63.963h89.438V113.467z M143.517,63.963v49.504H54.078V63.963H143.517z M54.078,259.011
	h89.439v49.504H54.078V259.011z"/>
<path fill="var(--iconBlackColor)" d="M484.961,149.406H197.926c-14.934,0-27.039,12.106-27.039,27.039v298.631
	c0,14.933,12.105,27.039,27.039,27.039h287.034c14.933,0,27.039-12.106,27.039-27.039V176.445
	C512,161.512,499.893,149.406,484.961,149.406z M368.483,307.067h89.438v37.388h-89.438V307.067z M457.922,252.989h-89.438v-49.504
	h89.438V252.989z M224.966,398.533h89.439v49.504h-89.439V398.533z M368.483,448.037v-49.504h89.438v49.504H368.483z"/>
<g>
	<rect x="224.966" y="307.067" style="fill:#7DD2F0;" width="89.435" height="37.388"/>
	<rect x="224.966" y="203.486" style="fill:#7DD2F0;" width="89.435" height="49.504"/>
</g>

</svg>
`
})
export class IconSpreadSheetComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
