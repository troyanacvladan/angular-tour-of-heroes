import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {MessageService} from '../message.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes : Hero[];

  constructor(
    private heroService:HeroService
   ) { }

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

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
    //There's really nothing for the component to do with the Observable returned by heroService.delete()
    // but it MUST subscribe anyway. If you neglect to subscribe(),
    // the service will not send the delete request to the server. As a rule,
    // an Observable does nothing until something subscribes.
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.addHero({ name } as Hero) //When the given name is non-blank, the handler creates a Hero-like object from the name (it's only missing the id) and passes it to the services addHero() method.
      .subscribe(hero => { //When addHero() saves successfully, the subscribe() callback receives the new hero
        this.heroes.push(hero); // and pushes it into to the heroes list for display.
      });
  }

}
