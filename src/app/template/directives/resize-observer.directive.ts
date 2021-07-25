import { Directive, ElementRef, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';

const entriesMap = new WeakMap();

const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
        if (entriesMap.has(entry.target)) {
            const comp = entriesMap.get(entry.target);
            comp.resizeCallback(entry);
        }
    }
});

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[resizeObserver]' })
export class ResizeObserverDirective implements OnDestroy {

    @Output() resizeElement = new EventEmitter<DOMRectReadOnly>();

    constructor(private el: ElementRef) {
        const target = this.el.nativeElement;
        entriesMap.set(target, this);
        ro.observe(target);
    }

    resizeCallback(entry): void {

        this.resizeElement.emit(entry.contentRect);
    }

    ngOnDestroy(): void {
        const target = this.el.nativeElement;
        ro.unobserve(target);
        entriesMap.delete(target);
    }
}
