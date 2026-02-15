
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
    templateUrl: './input.component.html',
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
