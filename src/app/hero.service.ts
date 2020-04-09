import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import {MessageService} from './message.service'; // reason: https://angular.io/tutorial/toh-pt4#observable-data

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    /*
  This is a typical "service-in-service" scenario:
  you inject the MessageService into the HeroService which is injected into the HeroesComponent.
*/
    private messageService: MessageService
  ) { }

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');

    // reason: https://angular.io/tutorial/toh-pt4#observable-heroservice
    return of(HEROES);
  }
}
