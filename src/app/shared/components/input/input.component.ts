
import { Component, Input, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ],
    template: `
    <div class="grid w-full max-w-sm items-center gap-2">
      <label *ngIf="label" [for]="id" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {{ label }}
      </label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        [ngClass]="inputClasses"
      />
      <p *ngIf="error" class="text-xs text-destructive font-medium mt-1">{{ error }}</p>
      <p *ngIf="hint" class="text-xs text-muted-foreground mt-1">{{ hint }}</p>
    </div>
  `,
    styles: []
})
export class InputComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() type: string = 'text';
    @Input() id: string = `input-${Math.random().toString(36).substr(2, 9)}`;
    @Input() error: string = '';
    @Input() hint: string = '';
    @Input() inputClasses: string = '';

    value = signal<string>('');
    disabled = false;

    onChange = (value: string) => { };
    onTouched = () => { };

    writeValue(value: string): void {
        this.value.set(value || '');
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.value.set(value);
        this.onChange(value);
    }
}
