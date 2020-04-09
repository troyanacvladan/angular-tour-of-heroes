import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes : Hero[];
  selectedHero: Hero;

  constructor(
    private heroService: HeroService,
    private messageService : MessageService
  ) { }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroService: Selected hero id=${hero.id}`);
  }

  /*
  The ngOnInit() is a 'lifecycle hook'. Angular calls ngOnInit() shortly after creating a component.
  It's a good place to put initialization logic.
  */
  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
    /*
      The previous version of this method (without above line) assigns an array of heroes to the component's heroes property.
      The assignment occurs synchronously, as if the server could return heroes instantly or the browser could freeze the UI while it waited for the server's response.
      That won't work when the HeroService is actually making requests of a remote server.

      This method version waits for the Observable to emit the array of heroes—which could happen now or several minutes from now.
      The subscribe() method passes the emitted array to the callback, which sets the component's heroes property.
      This asynchronous approach will work when the HeroService requests heroes from the server.
    */
  }

}
