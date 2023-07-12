import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService<T> {
  private events = new Subject<T>();

  addEvent(event: T) {
    this.events.next(event);
  }

  sendEvents() {
    return this.events.asObservable();
  }
}
