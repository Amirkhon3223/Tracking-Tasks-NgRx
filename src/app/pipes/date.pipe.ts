import { Pipe, PipeTransform } from '@angular/core';

interface DateRange {
  start: string | Date;
  end: string | Date;
}

@Pipe({
  name: 'datePipe'
})
export class DatePipe implements PipeTransform {
  /**
   * Преобразует значение даты или диапазона дат в строковое представление.
   * @param value Значение, которое требуется преобразовать.
   * @returns Строковое представление значения даты или диапазона дат.
   */
  transform(value: Date | DateRange): string {
    return (value instanceof Date)
      ? value.toLocaleDateString()
      : (typeof value === 'object' && 'start' in value && 'end' in value)
        ? `${new Date(value.start).toLocaleDateString()}
        - ${new Date(value.end).toLocaleDateString()}`
        : '';
  }
}
